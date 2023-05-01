import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThePoolConfigService } from '@src/modules/core/the-pool-config/services/the-pool-config.service';
import Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.local', '.env'],
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().default(3000),
        SECRET_KEY: Joi.string().required(),
        NODE_ENV: Joi.string().required(),
        DATABASE_URL: Joi.string().required(),
        AWS_ACCESS_KEY: Joi.string().required(),
        AWS_SECRET_KEY: Joi.string().required(),
        AWS_S3_REGION: Joi.string().required(),
        AWS_S3_BUCKET_NAME: Joi.string().required(),
        AWS_S3_ACL: Joi.string().required(),
        AWS_S3_EXPIRES: Joi.number().required(),
        AWS_CLOUD_FRONT_URL: Joi.string().required(),
        CLIENT_ID_GITHUB: Joi.string().required(),
        CLIENT_SECRET_GITHUB: Joi.string().required(),
        SERVER_EXCEPTION_CHANNEL_URL: Joi.required(),
      }),
    }),
  ],
  providers: [ThePoolConfigService],
  exports: [ConfigModule, ThePoolConfigService],
})
export class ThePoolConfigModule {}
