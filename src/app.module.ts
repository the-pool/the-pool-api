import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from '@src/app.controller';
import { AppService } from '@src/app.service';
import { ConfigModule } from '@nestjs/config';
import Joi from 'joi';
import { modules } from '@src/modules';
import { LoggerMiddleware } from '@src/middlewares/logger.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      validationSchema: Joi.object({
        PORT: Joi.number().default(3000),
        SECRET_KEY: Joi.string(),
        DATABASE_URL: Joi.string(),
      }),
      isGlobal: true,
    }),
    ...modules,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
