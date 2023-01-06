import {
  ForbiddenException,
  INestApplication,
  Injectable,
  InternalServerErrorException,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { NotFoundError } from '@prisma/client/runtime';
import { PrismaModel, PrismaModelName } from '@src/types/type';

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
}
