import { QueryResult } from './../../src/application/providers/cursor/cursor.provider.types';
import { Pizza } from '../../src/application/providers/pizzas/pizza.provider.types';
import { Pizza as newPizza } from '../../src/application/schema/types/schema';

import { ObjectId } from 'mongodb';
import { PizzaDocument } from 'src/entities/pizza';

const createMockPizza = (data?: Partial<newPizza>): newPizza => {
  return {
    __typename: 'Pizza',
    id: new ObjectId().toHexString(),
    name: 'Tsushima Pizza',
    description: 'TempPizza',
    imgSrc: 'Test ImgSrc',
    toppings: [],
    priceCents: 0,
    ...data,
  };
};

const createMockPizzaObject = (data?: Partial<Pizza>): Pizza => {
  return {
    id: new ObjectId().toHexString(),
    description: 'This isnt a real pizza dummy',
    imgSrc: 'https://source.unsplash.com/user/c_v_r',
    name: 'test-pizza',
    toppingIds: [],
    ...data,
  };
};

const createMockPizzaDocument = (data?: Partial<PizzaDocument>): PizzaDocument => {
  return {
    _id: new ObjectId(),
    name: 'Ghost of Tsushima Pizza',
    description: 'eat and game',
    imgSrc: 'Test Img',
    toppingIds: [],
    ...data,
  };
};

const createCursorResult = (pizzas: Pizza[]): QueryResult => {
  return {
    totalCount: 1,
    hasNextPage: false,
    cursor: null,
    results: pizzas,
  };
};

export { createMockPizzaDocument, createMockPizza, createMockPizzaObject, createCursorResult };
