import { createTestTopping } from './topping';
import { Pizza } from '../../../types/schema';
import { ObjectId } from 'bson';
import { GetPizzasResponse } from '../../../types/schema';

const testTopping = createTestTopping();
export const createTestPizza = (data: Partial<Pizza> = {}): Pizza => ({
  __typename: 'Pizza',
  description: 'Waow! A Pizza!!',
  id: new ObjectId().toHexString(),
  imgSrc: 'This',
  name: 'This is not a Pizza',
  priceCents: 0,
  toppings: [testTopping],
  ...data,
});

export const createQueryResult = (pizzas: Pizza[]): GetPizzasResponse => ({
  totalCount: pizzas.length,
  hasNextPage: true,
  cursor: null,
  results: pizzas,
});
