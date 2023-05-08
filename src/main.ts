import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from '@src/app.module';
import { HttpBadRequestExceptionFilter } from '@src/filters/http-bad-request-exception.filter';
import { HttpNestInternalServerErrorExceptionFilter } from '@src/filters/http-nest-Internal-server-error-exception.filter';
import { HttpNodeInternalServerErrorExceptionFilter } from '@src/filters/http-node-internal-server-error-exception.filter';
import { HttpNotFoundExceptionFilter } from '@src/filters/http-not-found-exception.filter';
import { HttpRemainderExceptionFilter } from '@src/filters/http-remainder-exception.filter';
import { JwtExceptionFilter } from '@src/filters/jwt-exception.filter';
import { SuccessInterceptor } from '@src/interceptors/success.interceptor';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { NotificationService } from '@src/modules/core/notification/services/notification.service';
import { ENV_KEY } from '@src/modules/core/the-pool-config/constants/the-pool-config.constant';
import { ThePoolConfigService } from '@src/modules/core/the-pool-config/services/the-pool-config.service';
import { useContainer } from 'class-validator';
import helmet from 'helmet';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const thePoolConfigService =
    app.get<ThePoolConfigService>(ThePoolConfigService);
  const isProduction = thePoolConfigService.isProduction();

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
    new JwtExceptionFilter(),
  );

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  // Starts listening for shutdown hooks
  if (isProduction) {
    app.enableShutdownHooks();

    app.enableCors({
      allowedHeaders: ['content-type', 'authorization'],
      origin: [
        'http://localhost:3000',
        'https://dev.thepool.kr',
        'https://thepool.kr/',
      ],
      credentials: true,
    });
  } else {
    app.enableCors({
      allowedHeaders: ['content-type', 'authorization'],
      origin: [
        'http://localhost:3000',
        'https://dev.thepool.kr',
        'https://thepool.kr/',
      ],
      credentials: true,
    });

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

  const PORT = thePoolConfigService.get<number>(ENV_KEY.PORT) || 3000;

  await app.listen(PORT);
  console.info(`server listening on port ${PORT}`);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

bootstrap();
