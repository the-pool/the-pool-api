import { Module } from '@nestjs/common';
import { AppController } from '@src/app.controller';
import { AppService } from '@src/app.service';
import { ConfigModule } from '@nestjs/config';
import Joi from 'joi';
import { modules } from '@src/modules';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      validationSchema: Joi.object({ PORT: Joi.number().default(3000) }),
    }),
    ...modules,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
