import { Injectable } from '@nestjs/common';
import { NotFoundError } from '@prisma/client/runtime';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { PrismaModelName } from '@src/types/type';

@Injectable()
export class PrismaHelper {
  constructor(private readonly prismaService: PrismaService) {}
  /**
   * A라는 id를 가진 자식요소가 B라는 부모 요소의 자식 요소가 맞는지 확인할 때 사용하려고 만든 메서드
   *
   * where 조건에 해당하는 row가 없다면 NotFoundError가 발생하기 때문에 Controller에 @UseFilters(NotFoundErrorFilter)추가해야 한다.
   * NotFoundErrorFilter에서는 상태코드 404가 아닌 403 return 함에 주의
   */
  async findOneOrFail(modelName: PrismaModelName, where: any) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    await this.prismaService[modelName].findFirstOrThrow({
      where,
    });
  }
}
