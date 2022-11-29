import { Topping } from './topping';

export interface Pizza {
  id: string;
  name: string;
  description: string;
  imgSrc: string;
  toppings: Array<Topping>;
  priceCents: number;
}
