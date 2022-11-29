import { PizzasResponseInput } from './../../../../client/src/types/schema.d';
import { ObjectId } from 'mongodb';
import { Pizza as newPizza, CreatePizzaInput, UpdatePizzaInput } from '../schema/types/schema';
import { pizzaProvider } from '../providers';
import { Root } from '../schema/types/types';
import { GetPizzasResponse } from '../providers/pizzas/pizza.provider.types';

export interface Pizza extends Omit<newPizza, 'toppings' | 'priceCents'> {
  toppingIds: string[];
}

const pizzaResolver = {
  Query: {
    pizzas: async (_: Root, args: { input: PizzasResponseInput }): Promise<GetPizzasResponse> => {
      return pizzaProvider.getPizzas(args.input);
    },
  },
  Mutation: {
    createPizza: async (_: Root, args: { input: CreatePizzaInput }): Promise<Pizza> => {
      return pizzaProvider.createPizza(args.input);
    },
    updatePizza: async (_: Root, args: { input: UpdatePizzaInput }): Promise<Pizza> => {
      return pizzaProvider.updatePizza(args.input);
    },
    deletePizza: async (_: Root, args: { input: string }): Promise<ObjectId> => {
      return pizzaProvider.deletePizza(args.input);
    },
  },
};

export { pizzaResolver };
