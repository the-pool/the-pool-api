import {
  ConflictException,
  ForbiddenException,
  INestApplication,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import {
  Lesson,
  LessonCategory,
  LessonHashtagMapping,
  Prisma,
  PrismaClient,
} from '@prisma/client';
import { NotFoundError } from '@prisma/client/runtime';
import { PrismaModel, PrismaModelName } from '@src/types/type';
import { extend, number } from 'joi';

@Injectable()
export class PrismaService
  extends PrismaClient<Prisma.PrismaClientOptions, 'query' | 'error'>
  implements OnModuleInit
{
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log: [
        {
          emit: 'event',
          level: 'query',
        },
        {
          emit: 'event',
          level: 'error',
        },
        {
          emit: 'stdout',
          level: 'info',
        },
        {
          emit: 'stdout',
          level: 'warn',
        },
      ],
    });

    this.$on<any>('query', (event: Prisma.QueryEvent) => {
      this.logger.debug('Query: ' + event.query);
      this.logger.debug('Params: ' + event.params);
      this.logger.debug('Duration: ' + event.duration + 'ms');
    });
  }

  async onModuleInit() {
    this.$on('error', (event) => {
      this.logger.verbose(event.target);
    });
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }

  /**
   * @todo where 타입 개선해야 함 우선 type.ts에 PrismaWhereInput 타입 정의해 놓았음
   */
  findOneOrFail(modelName: PrismaModelName, where: any): Promise<PrismaModel> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return this[modelName].findFirstOrThrow({
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

  /**
   * where 조건에 맞는 리소스가 존재하면 Conflict 에러를 뱉는 메서드
   */
  async validateDuplicateAndFail(
    modelName: PrismaModelName,
    where: any,
  ): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const prismaModel: PrismaModel | null = await this[modelName].findFirst({
      where,
    });

    if (prismaModel) {
      throw new ConflictException(`${modelName} is duplicated `);
    }
    return;
  }

  /**
   * 매핑테이블의 매핑된 데이터 정보 유효성 검사를 해주는 메서드
   */
  // 매핑 테이블 과제 id, 해시태그 id
  async validateMappedData(
    modelName: PrismaModelName,
    where: Record<string, number | { in: number[] }>,
    length: number,
  ) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const prismaModels: PrismaModel[] = await this[modelName].findMany({
      where,
    });

    if (prismaModels.length !== length) {
      4;
      throw new ForbiddenException(`You do not have access to ${modelName}`);
    }
    return;
  }
}
