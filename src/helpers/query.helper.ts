import { Injectable } from '@nestjs/common';
import { OrderBy } from '@src/constants/enum';

@Injectable()
export class QueryHelper {
  buildWherePropForFind<T>(
    filter: Record<string, any>,
    likeSearchFields?: string[],
  ): Record<string, any> {
    const where = {};

    for (const key in filter) {
      if (filter[key] === '') continue;

      if (likeSearchFields.includes(key)) {
        where[key] = { contains: filter[key] };
      } else {
        where[key] = filter[key];
      }
    }

    return where;
  }

  buildOrderByPropForFind<K extends string>(
    orderBy: OrderBy[],
    sortBy: K[],
  ): { [P in K]: OrderBy }[] {
    const order = [];

    if (orderBy.length !== sortBy.length) return;

    for (let i = 0; i < orderBy.length; i += 1) {
      if (orderBy[i] && sortBy[i]) {
        order.push({ [sortBy[i]]: orderBy[i] });
      }
    }

    return order;
  }
}
