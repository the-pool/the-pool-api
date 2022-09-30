import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from '@src/app.module';
import helmet from 'helmet';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { SuccessInterceptor } from '@src/interceptors/success.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { HttpExceptionFilter } from '@src/filters/http-exception.filter';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService>(ConfigService);

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
  app.useGlobalFilters(new HttpExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('title example')
    .setDescription('description example')
    .setVersion('1.0')
    .addTag('tag example')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  const PORT = configService.get<number>('PORT');

  await app.listen(PORT);

  console.info(`server listening on port ${PORT}`);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

bootstrap();
