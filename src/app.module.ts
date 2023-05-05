import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AppController } from '@src/app.controller';
import { AppService } from '@src/app.service';
import { IsRecordConstraint } from '@src/decorators/is-record.decorator';
import { LoggerMiddleware } from '@src/middlewares/logger.middleware';
import { modules } from '@src/modules';
import { IsRecordManyConstraint } from './decorators/is-record-many.decorator';

@Module({
  imports: [
    ...modules,
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
  ],
  controllers: [AppController],
  providers: [AppService, IsRecordConstraint, IsRecordManyConstraint],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
