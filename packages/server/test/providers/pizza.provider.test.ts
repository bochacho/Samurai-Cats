import { GetCursorResultsInput } from './../../src/application/providers/cursor/cursor.provider.types';
import { ObjectId, Collection } from 'mongodb';
import { stub, reveal } from 'jest-auto-stub';
import { PizzaDocument, toPizzaObject } from '../../src/entities/pizza';
import { ToppingProvider } from '../../src/application/providers/toppings/topping.provider';
import { PizzaProvider } from '../../src/application/providers/pizzas/pizza.provider';
import { createCursorResult, createMockPizzaDocument } from '../../test/helpers/pizza.helper';
import { CursorProvider } from './../../src/application/providers/cursor/cursor.provider';

const stubPizzaCollection = stub<Collection<PizzaDocument>>();
const stubToppingProvider = stub<ToppingProvider>();

const stubCursorProvider = stub<CursorProvider>();

const pizzaProvider = new PizzaProvider(stubPizzaCollection, stubToppingProvider, stubCursorProvider);

beforeEach(jest.clearAllMocks);

describe('pizzaProvider', (): void => {
  const mockPizzaDocument = createMockPizzaDocument();
  const mockPizza = toPizzaObject(mockPizzaDocument);
  const cursorResult = createCursorResult([mockPizza]);

  describe('getPizzas', (): void => {
    beforeEach(() => {
      reveal(stubCursorProvider).getCursorResult.mockImplementation(() => Promise.resolve(cursorResult));
    });
    test('Should call find once', async () => {
      await pizzaProvider.getPizzas({ limit: 5 });
      expect(stubCursorProvider.getCursorResult).toHaveBeenCalledTimes(1);
    });
    test('Should get all pizzas', async () => {
      const result = await pizzaProvider.getPizzas({ limit: 5 });
      expect(result).toEqual({
        cursor: null,
        hasNextPage: false,
        totalCount: 1,
        results: [mockPizza],
      });
    });
  });

  describe('createPizza', (): void => {
    const validPizza = createMockPizzaDocument({
      name: 'Tsushima Pizza',
      description: 'Test',
      imgSrc: 'Test',
      toppings: ['TestID'],
    });
    beforeEach(() => {
      reveal(stubPizzaCollection).findOneAndUpdate.mockImplementation(() => ({ value: validPizza }));
    });
    test('Should call findOneAndUpdate once', async () => {
      await pizzaProvider.createPizza({
        name: validPizza.name,
        description: validPizza.description,
        imgSrc: validPizza.imgSrc,
        toppingIds: validPizza.toppingIds,
      });
      expect(stubPizzaCollection.findOneAndUpdate).toHaveBeenCalledTimes(1);
    });
    test('should return a pizza when passed valid input', async () => {
      const result = await pizzaProvider.createPizza({
        name: validPizza.name,
        description: validPizza.description,
        imgSrc: validPizza.imgSrc,
        toppingIds: validPizza.toppingIds,
      });
      expect(result).toEqual(toPizzaObject(validPizza));
    });
  });

  describe('updatePizza', (): void => {
    const validPizza = createMockPizzaDocument({
      name: 'Test Pizza',
      description: 'Test',
      imgSrc: 'Test',
      toppingIds: ['TestId'],
    });

    beforeEach(() => {
      reveal(stubPizzaCollection).findOneAndUpdate.mockImplementation(() => ({
        value: validPizza,
      }));
    });

    test('should call findOneAndUpdate once', async () => {
      await pizzaProvider.updatePizza({
        id: validPizza.id,
        name: validPizza.name,
        imgSrc: validPizza.imgSrc,
        description: validPizza.imgSrc,
        toppingIds: validPizza.toppingIds,
      });
      expect(stubPizzaCollection.findOneAndUpdate).toHaveBeenCalledTimes(1);
    });

    test('should return a Pizza', async () => {
      const result = await pizzaProvider.updatePizza({
        id: validPizza.id,
        name: validPizza.name,
        imgSrc: validPizza.imgSrc,
        description: validPizza.imgSrc,
        toppingIds: validPizza.toppingIds,
      });
      expect(result).toEqual(toPizzaObject(validPizza));
    });
  });

  describe('deletePizza', (): void => {
    beforeEach(() => {
      reveal(stubPizzaCollection).findOneAndDelete.mockImplementation(() => ({ value: mockPizzaDocument }));
    });
    test('Should call findOneAndDelete once', async () => {
      await pizzaProvider.deletePizza(mockPizza.id);
      expect(stubPizzaCollection.findOneAndDelete).toHaveBeenCalledTimes(1);
    });
    test('Should throw an error findOneAndDelete returns null', async () => {
      reveal(stubPizzaCollection).findOneAndDelete.mockImplementation(() => ({ value: null }));
      await expect(pizzaProvider.deletePizza(mockPizza.id)).rejects.toThrow(new Error('Could not delete the pizza'));
    });
    test('Should return an ID', async () => {
      const result = await pizzaProvider.deletePizza(mockPizza.id);
      expect(result).toEqual(new ObjectId(mockPizza.id));
    });
  });
});
