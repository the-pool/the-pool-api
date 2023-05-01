import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from '@src/app.controller';
import { AppService } from '@src/app.service';
import { IsRecordConstraint } from '@src/decorators/is-record.decorator';
import { LoggerMiddleware } from '@src/middlewares/logger.middleware';
import { modules } from '@src/modules';
import { IsRecordManyConstraint } from './decorators/is-record-many.decorator';

@Module({
  imports: [...modules],
  controllers: [AppController],
  providers: [AppService, IsRecordConstraint, IsRecordManyConstraint],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
