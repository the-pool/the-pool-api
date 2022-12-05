import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from '@src/app.module';
import helmet from 'helmet';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { SuccessInterceptor } from '@src/interceptors/success.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { useContainer } from 'class-validator';
import { HttpBadRequestExceptionFilter } from '@src/filters/http-bad-request-exception.filter';
import { HttpNodeInternalServerErrorExceptionFilter } from '@src/filters/http-node-internal-server-error-exception.filter';
import { HttpRemainderExceptionFilter } from '@src/filters/http-remainder-exception.filter';
import { HttpNestInternalServerErrorExceptionFilter } from '@src/filters/http-nest-Internal-server-error-exception.filter';
import { HttpNotFoundExceptionFilter } from '@src/filters/http-not-found-exception.filter';
import { JwtExceptionFilter } from './filters/jwt-exception.filter';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService>(ConfigService);
  const isProduction = configService.get<string>('NODE_ENV') === 'production';

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
    new HttpNodeInternalServerErrorExceptionFilter(isProduction),
    new HttpRemainderExceptionFilter(),
    new HttpNestInternalServerErrorExceptionFilter(isProduction),
    new HttpNotFoundExceptionFilter(),
    new HttpBadRequestExceptionFilter(),
    new JwtExceptionFilter(),
  );

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  // Starts listening for shutdown hooks
  if (isProduction) {
    app.enableShutdownHooks();

    app.enableCors({ origin: ['domain'], credentials: true });
  } else {
    app.enableCors({ origin: true, credentials: true });

    const config = new DocumentBuilder()
      .setTitle('title example')
      .setDescription('description example')
      .setVersion('1.0')
      .addTag('tag example')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup('api-docs', app, document);
  }

  const PORT = configService.get<number>('PORT');

  await app.listen(PORT);

  console.info(`server listening on port ${PORT}`);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

bootstrap();
