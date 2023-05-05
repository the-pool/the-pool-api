import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AppController } from '@src/app.controller';
import { AppService } from '@src/app.service';
import { IsRecordConstraint } from '@src/decorators/is-record.decorator';
import { LoggerMiddleware } from '@src/middlewares/logger.middleware';
import { modules } from '@src/modules';
import Joi from 'joi';
import { IsRecordManyConstraint } from './decorators/is-record-many.decorator';

@Module({
  imports: [
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
        AWS_CLOUD_FRONT_URL: Joi.string(),
        GITHUB_CLIENT_ID: Joi.string(),
        GITHUB_CLIENT_SECRET: Joi.string(),
      }),
      isGlobal: true,
    }),
    EventEmitterModule.forRoot({
      // set this to `true` to use wildcards
      wildcard: false,
      // the delimiter used to segment namespaces
      delimiter: '.',
      // set this to `true` if you want to emit the newListener event
      newListener: false,
      // set this to `true` if you want to emit the removeListener event
      removeListener: false,
      // the maximum amount of listeners that can be assigned to an event
      maxListeners: 10,
      // show event name in memory leak message when more than maximum amount of listeners is assigned
      verboseMemoryLeak: true,
      // disable throwing uncaughtException if an error event is emitted and it has no listeners
      ignoreErrors: false,
    }),

    ...modules,
  ],
  controllers: [AppController],
  providers: [AppService, IsRecordConstraint, IsRecordManyConstraint],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
