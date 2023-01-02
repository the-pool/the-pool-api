import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { NotFoundError } from '@prisma/client/runtime';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { PrismaModel, PrismaModelName } from '@src/types/type';

@Injectable()
export class PrismaHelper {
  constructor(private readonly prismaService: PrismaService) {}

  findOneOrFail(modelName: PrismaModelName, where: any): Promise<PrismaModel> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return this.prismaService[modelName].findFirstOrThrow({
      where,
    });
  }

  /**
   * A라는 id를 가진 자식요소가 B라는 부모 요소의 자식 요소가 맞는지 확인할 때 사용하려고 만든 메서드
   * 성공 : Model의 id에 해당하는 리소스 return
   * 실패 : status - 403, message - You do not have access to ${modelName}
   */
  validateOwnerOrFail(
    modelName: PrismaModelName,
    where: any,
  ): Promise<PrismaModel> {
    return this.findOneOrFail(modelName, where)
      .then()
      .catch((err) => {
        if (err instanceof NotFoundError) {
          throw new ForbiddenException(
            `You do not have access to ${modelName}`,
          );
        }

        throw new InternalServerErrorException(err);
      });
  }

  async validateDuplicateAndFail(
    modelName: PrismaModelName,
    where: any,
  ): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { length } = await this.prismaService[modelName].findMany({
      where,
    });

    if (length) {
      throw new ConflictException(`${modelName} is duplicatd`);
    }
    return;
  }
}
