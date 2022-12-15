import { Injectable } from '@nestjs/common';
import { NotFoundError } from '@prisma/client/runtime';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { PrismaModelName } from '@src/types/type';

@Injectable()
export class PrismaHelper {
  constructor(private readonly prismaService: PrismaService) {}
  /**
   * where 조건에 해당하는 row가 없다면 NotFoundError가 발생하기 때문에 Controller에 @UseFilters(NotFoundErrorFilter)추가해야 한다.
   */
  async findOneOrFail(modelName: PrismaModelName, where: any) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    await this.prismaService[modelName].findFirstOrThrow({
      where,
    });
  }
}
