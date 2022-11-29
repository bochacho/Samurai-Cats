import { GetCursorResultsInput, QueryResult } from './cursor.provider.types';
import { PizzaDocument, toPizzaObject } from './../../../entities/pizza';
import { Collection } from 'mongodb';

class CursorProvider {
  constructor(private collection: Collection<PizzaDocument>) {}

  public async getCursorIndex(cursor?: string | null) {
    if (cursor) {
      const pizzas = await this.collection.find().sort({ name: 1 }).toArray();

      const index = pizzas.findIndex((element) => cursor === element._id.toHexString());
      return index + 1;
    } else {
      return 0;
    }
  }

  public async getCursorResult({ limit, cursor }: GetCursorResultsInput): Promise<QueryResult> {
    let hasNextPage = false;
    const toSkip = await this.getCursorIndex(cursor);

    const data = await this.collection
      .find()
      .sort({ name: 1 })
      .skip(toSkip)
      .limit(limit + 1)
      .toArray();

    if (data.length > limit) {
      hasNextPage = true;
      data.pop();
    }
    const results = data.map((pizza) => toPizzaObject(pizza));

    const totalCount = data.length;

    const nextCursor = totalCount < limit ? null : data[limit - 1]._id;
    return {
      totalCount: totalCount,
      hasNextPage: hasNextPage,
      results: results,
      cursor: nextCursor,
    };
  }
}

export { CursorProvider };
