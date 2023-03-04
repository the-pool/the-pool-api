import {
  ClassSerializerInterceptor,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@src/app.module';
import { HttpBadRequestExceptionFilter } from '@src/filters/http-bad-request-exception.filter';
import { HttpNestInternalServerErrorExceptionFilter } from '@src/filters/http-nest-Internal-server-error-exception.filter';
import { HttpNodeInternalServerErrorExceptionFilter } from '@src/filters/http-node-internal-server-error-exception.filter';
import { HttpNotFoundExceptionFilter } from '@src/filters/http-not-found-exception.filter';
import { HttpRemainderExceptionFilter } from '@src/filters/http-remainder-exception.filter';
import { SuccessInterceptor } from '@src/interceptors/success.interceptor';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { NotificationService } from '@src/modules/core/notification/services/notification.service';
import { useContainer } from 'class-validator';
import helmet from 'helmet';
import Joi from 'joi';

export const setTestingApp = async (): Promise<INestApplication> => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [
      AppModule,
      ConfigModule.forRoot({
        envFilePath: ['.env.local', '.env'],
        validationSchema: Joi.object({
          PORT: Joi.number().default(3000),
          SECRET_KEY: Joi.string(),
          DATABASE_URL: Joi.string(),
          AWS_S3_ACCESS_KEY: Joi.string(),
          AWS_S3_SECRET_KEY: Joi.string(),
          AWS_S3_REGION: Joi.string(),
          AWS_S3_BUCKET_NAME: Joi.string(),
          AWS_S3_EXPIRES: Joi.number(),
          AWS_S3_ACL: Joi.string(),
        }),
        isGlobal: true,
      }),
    ],
  }).compile();

  const app = moduleFixture.createNestApplication<INestApplication>();
  const configService = app.get<ConfigService>(ConfigService);
  const isProduction = configService.get<string>('NODE_ENV') === 'production';

  const notificationService = app.get<NotificationService>(NotificationService);
  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  app.use(helmet());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      stopAtFirstError: true,
      whitelist: true,
    }),
  );
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalInterceptors(new SuccessInterceptor());
  app.useGlobalFilters(
    new HttpNodeInternalServerErrorExceptionFilter(
      notificationService,
      isProduction,
    ),
    new HttpRemainderExceptionFilter(),
    new HttpNestInternalServerErrorExceptionFilter(
      notificationService,
      isProduction,
    ),
    new HttpNotFoundExceptionFilter(),
    new HttpBadRequestExceptionFilter(),
  );

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  return app;
};
