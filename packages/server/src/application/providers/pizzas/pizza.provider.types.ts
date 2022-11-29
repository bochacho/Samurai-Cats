import { ObjectId } from 'mongodb';

export interface Pizza {
  id: string;
  name: string;
  description: string;
  toppingIds: string[];
  imgSrc: string;
}

export interface GetPizzasResponse {
  totalCount: number;
  hasNextPage: boolean;
  cursor: ObjectId | null;
  results: Pizza[];
}
export interface PizzasResponseInput {
  limit: number;
  cursor?: ObjectId;
}

export interface CreatePizzaInput {
  name: string;
  description: string;
  imgSrc: string;
  toppingIds: string[];
}

export interface UpdatePizzaInput {
  id: string;
  name?: string | null;
  description?: string | null;
  imgSrc?: string | null;
  toppingIds?: string[] | null;
}
