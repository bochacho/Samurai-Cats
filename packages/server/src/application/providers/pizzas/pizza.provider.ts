import { ToppingProvider } from 'src/application/providers/toppings/topping.provider';
import validateStringInputs from '../../../lib/string-validator';
import { CreatePizzaInput, PizzasResponseInput, UpdatePizzaInput } from './../../../../../client/src/types/schema.d';
import { ObjectId, Collection } from 'mongodb';
import { PizzaDocument, toPizzaObject } from '../../../entities/pizza';
import { Pizza } from './pizza.provider.types';
import { CursorProvider } from './../cursor/cursor.provider';
import { GetPizzasResponse } from './pizza.provider.types';

class PizzaProvider {
  constructor(
    private collection: Collection<PizzaDocument>,
    private toppingProvider: ToppingProvider,
    private cursorProvider: CursorProvider
  ) {}

  public async getPizzas(input: PizzasResponseInput): Promise<GetPizzasResponse> {
    const response = await this.cursorProvider.getCursorResult(input);
    return response;
  }

  public async createPizza(input: CreatePizzaInput): Promise<Pizza> {
    const { name, description, imgSrc, toppingIds } = input;
    validateStringInputs([name, description, imgSrc]);
    await this.toppingProvider.validateToppings(toppingIds);

    const data = await this.collection.findOneAndUpdate(
      { _id: new ObjectId() },
      { $set: { ...input, updatedAt: new Date().toISOString(), createdAt: new Date().toISOString() } },
      { upsert: true, returnDocument: 'after' }
    );

    if (!data.value) {
      throw new Error(`Could not create the ${input.name} topping`);
    }
    const pizza = data.value;
    return toPizzaObject(pizza);
  }

  public async updatePizza(input: UpdatePizzaInput): Promise<Pizza> {
    const { id, name, description, imgSrc, toppingIds } = input;

    [id, name, description, imgSrc].forEach((inVal) => {
      if (inVal) {
        validateStringInputs(inVal);
      }
    });

    if (toppingIds) {
      await this.toppingProvider.validateToppings(toppingIds);
    }

    const data = await this.collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...(name && { name: name }),
          ...(description && { description: description }),
          ...(imgSrc && { imgSrc: imgSrc }),
          ...(toppingIds && { toppingIds: toppingIds }),
        },
      },
      { returnDocument: 'after' }
    );

    if (!data.value) {
      throw new Error(`Could not update the topping`);
    }

    const pizza = data.value;

    return toPizzaObject(pizza);
  }

  public async deletePizza(id: string): Promise<ObjectId> {
    const pizzaId = new ObjectId(id);
    const data = await this.collection.findOneAndDelete({
      _id: pizzaId,
    });

    if (!data.value) {
      throw new Error(`Could not delete the pizza`);
    }
    return pizzaId;
  }
}
export { PizzaProvider };
