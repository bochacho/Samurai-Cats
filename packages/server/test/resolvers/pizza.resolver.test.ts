import {
  MutationCreatePizzaArgs,
  MutationDeletePizzaArgs,
  MutationUpdatePizzaArgs,
  QueryPizzasArgs,
  GetPizzasResponse,
} from './../../../client/src/types/schema.d';
import { gql } from 'apollo-server-core';
import { pizzaProvider, toppingProvider, cursorProvider } from '../../src/application/providers';
import { pizzaResolver } from '../../src/application/resolvers/pizza.resolver';
import { toppingResolver } from '../../src/application/resolvers/topping.resolver';
import { typeDefs } from '../../src/application/schema';
import { TestClient } from '../../test/helpers/client.helper';
import { createCursorResult, createMockPizza, createMockPizzaObject } from '../../test/helpers/pizza.helper';
import { createMockTopping } from '../../test/helpers/topping.helper';

let client: TestClient;

jest.mock('../../src/application/database', () => ({
  setupDb: (): any => ({ collection: (): any => jest.fn() }),
}));

beforeAll(async (): Promise<void> => {
  client = new TestClient(typeDefs, [pizzaResolver, toppingResolver]);
});

beforeEach(async (): Promise<void> => {
  jest.restoreAllMocks();
});

const mockTopping = createMockTopping();
const mockPizza = createMockPizza({ toppings: [mockTopping], priceCents: mockTopping.priceCents });
const resultPizzaData = {
  name: mockPizza.name,
  id: mockPizza.id,
  description: mockPizza.description,
  imgSrc: mockPizza.imgSrc,
  toppingIds: mockPizza.toppings.map((topping) => topping.id),
};
const cursorResult = createCursorResult([resultPizzaData]);

describe('pizzaResolver', (): void => {
  describe('Query', () => {
    describe('pizzas', () => {
      const query = gql`
        query ($input: PizzasResponseInput!) {
          pizzas(input: $input) {
            cursor
            hasNextPage
            totalCount
            results {
              name
              id
              toppings {
                name
                id
                priceCents
              }
              description
              imgSrc
              priceCents
            }
          }
        }
      `;
      test('should get all pizzas', async () => {
        const variables: QueryPizzasArgs = {
          input: {
            cursor: null,
            limit: 5,
          },
        };
        jest.spyOn(toppingProvider, 'getToppingsfromIds').mockResolvedValue([
          {
            id: mockTopping.id,
            name: mockTopping.name,
            priceCents: mockTopping.priceCents,
          },
        ]);
        jest.spyOn(toppingProvider, 'getPriceCents').mockResolvedValue(mockTopping.priceCents);
        jest.spyOn(cursorProvider, 'getCursorResult').mockResolvedValue(cursorResult);
        jest.spyOn(pizzaProvider, 'getPizzas').mockResolvedValue(cursorResult);
        const result = await client.query({ query, variables });

        expect(result.data).toEqual({
          pizzas: {
            __typename: 'GetPizzasResponse',
            cursor: null,
            hasNextPage: false,
            totalCount: 1,
            results: [
              {
                __typename: 'Pizza',
                name: mockPizza.name,
                id: mockPizza.id,
                toppings: mockPizza.toppings,
                description: mockPizza.description,
                imgSrc: mockPizza.imgSrc,
                priceCents: mockPizza.priceCents,
              },
            ],
          },
        });
        expect(pizzaProvider.getPizzas).toHaveBeenCalledTimes(1);
      });
    });
  });
  describe('Mutation', () => {
    describe('createPizza', () => {
      const mutation = gql`
        mutation ($input: CreatePizzaInput!) {
          createPizza(input: $input) {
            name
            imgSrc
            description
            toppingIds
          }
        }
      `;
      const validTopping = createMockTopping({
        name: 'Test Topping',
        priceCents: 123,
      });
      const validPizza = createMockPizzaObject({
        name: 'Test Pizza',
        imgSrc: 'Test',
        description: 'Test',
        toppingIds: [validTopping.id],
      });

      beforeEach(() => {
        jest.spyOn(pizzaProvider, 'createPizza').mockResolvedValue(validPizza);
      });
      test('should call create pizza when passed a valid input', async () => {
        const variables: MutationCreatePizzaArgs = {
          input: {
            name: validPizza.name,
            description: validPizza.description,
            imgSrc: validPizza.imgSrc,
            toppingIds: validPizza.toppingIds,
          },
        };
        await client.mutate({ mutation, variables });
        expect(pizzaProvider.createPizza).toHaveBeenCalledWith(variables.input);
      });
      test('should return created pizza when passed a valid input', async () => {
        const variables: MutationCreatePizzaArgs = {
          input: {
            name: validPizza.name,
            description: validPizza.description,
            imgSrc: validPizza.imgSrc,
            toppingIds: validPizza.toppingIds,
          },
        };
        const result = await client.mutate({ mutation, variables });
        expect(result.data).toEqual({
          createPizza: {
            __typename: 'Pizza',
            name: validPizza.name,
            description: validPizza.description,
            imgSrc: validPizza.imgSrc,
          },
        });
      });
    });
    describe('deletePizza', () => {
      const mutation = gql`
        mutation ($input: DeletePizzaInput!) {
          deletePizza(input: $input)
        }
      `;
      const variables: MutationDeletePizzaArgs = { input: { id: mockPizza.id } };

      beforeEach(() => {
        jest.spyOn(pizzaProvider, 'deletePizza').mockReturnValue(mockPizza.id);
      });
      test('should call deletePizza with id', async () => {
        await client.mutate({ mutation, variables });

        expect(pizzaProvider.deletePizza).toHaveBeenCalledWith(variables.input);
      });
      test('should call deleted pizza id', async () => {
        const result = await client.mutate({ mutation, variables });
        expect(result.data).toEqual({
          deletePizza: mockPizza.id,
        });
      });
    });
    describe('updatePizza', () => {
      const mutation = gql`
        mutation ($input: UpdatePizzaInput!) {
          updatePizza(input: $input) {
            id
            name
            description
            imgSrc
            toppingIds
          }
        }
      `;
      const validTopping = createMockTopping({
        name: 'Test Topping',
        priceCents: 123,
      });
      const updatedPizza = createMockPizza({
        name: 'Updated Pizza',
        imgSrc: 'Test',
        description: 'Test',
        toppings: [validTopping],
        priceCents: validTopping.priceCents,
      });
      const variables: MutationUpdatePizzaArgs = {
        input: {
          id: mockPizza.id,
          name: updatedPizza.name,
        },
      };
      beforeEach(() => {
        jest.spyOn(pizzaProvider, 'updatePizza').mockResolvedValue({
          id: updatedPizza.id,
          name: updatedPizza.name,
          description: updatedPizza.description,
          imgSrc: updatedPizza.imgSrc,
          toppingIds: [validTopping.id],
        });
      });
      test('should call updatePizza with input', async () => {
        await client.mutate({ mutation, variables });
        expect(pizzaProvider.updatePizza).toHaveBeenCalledWith(variables.input);
      });
      test('should return updated Pizza', async () => {
        const result = await client.mutate({ mutation, variables });
        expect(result.data).toEqual({
          updatePizza: {
            __typename: 'Pizza',
            id: updatedPizza.id,
            name: updatedPizza.name,
            description: updatedPizza.description,
            imgSrc: updatedPizza.imgSrc,
          },
        });
      });
    });
  });
});
