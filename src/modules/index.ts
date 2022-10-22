import { HealthModule } from '@src/modules/health/health.module';
import { ExampleModule } from '@src/modules/example/example.module';
import { CoreModule } from '@src/modules/core/core.module';
import { UserModule } from '@src/modules/user/user.module';
import { PostModule } from '@src/modules/post/post.module';
import { HttpConfigModule } from './core/http/http-config.module';

export const modules = [
  HealthModule,
  ExampleModule,
  CoreModule,
  UserModule,
  PostModule,
  HttpConfigModule,
];
