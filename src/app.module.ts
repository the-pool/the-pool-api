import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from '@src/app.controller';
import { AppService } from '@src/app.service';
import { IsRecordConstraint } from '@src/decorators/is-record.decorator';
import { LoggerMiddleware } from '@src/middlewares/logger.middleware';
import { modules } from '@src/modules';
import Joi from 'joi';

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
      }),
      isGlobal: true,
    }),
    ...modules,
  ],
  controllers: [AppController],
  providers: [AppService, IsRecordConstraint],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
