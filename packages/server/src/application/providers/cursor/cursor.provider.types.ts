import { ObjectId } from 'mongodb';
import { Pizza } from '../pizzas/pizza.provider.types';
export interface GetCursorResultsInput {
  limit: number;
  cursor?: string | null;
}

export interface QueryResult {
  totalCount: number;
  hasNextPage: boolean;
  results: Pizza[];
  cursor: ObjectId | null;
}
