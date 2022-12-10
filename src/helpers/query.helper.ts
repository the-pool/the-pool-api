import { Injectable } from '@nestjs/common';
import { OrderBy } from '@src/constants/enum';

@Injectable()
export class QueryHelper {
  /**
   * find 시 where field 를 만드는 메서드
   */
  buildWherePropForFind(
    filter: Record<string, any>,
    likeSearchFields?: string[],
  ): Record<string, any> {
    const where = {};

    for (const key in filter) {
      if (filter[key] === '') continue;

      if (likeSearchFields?.includes(key)) {
        where[key] = { contains: filter[key] };
      } else {
        where[key] = filter[key];
      }
    }

    return where;
  }

  /**
   * find 시 order by field 를 만드는 메서드
   */
  buildOrderByPropForFind(
    orderBy: OrderBy[],
    sortBy: string[],
  ): { [key: string]: OrderBy }[] {
    if (orderBy.length !== sortBy.length) {
      return [{ id: OrderBy.Asc }];
    }

    return orderBy.map((order, idx) => {
      return {
        [sortBy[idx]]: order,
      };
    });
  }
}
