import { DynamicModule, Module, UseInterceptors } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { HashtagController } from './controllers/hashtag.controllers';
import { HASHTAG_SERVICE } from './interfaces/hashtag-service.interface';

@Module({})
export class HashtagModule {
  static register(options: any, path): DynamicModule {
    return {
      module: HashtagModule,
      controllers: [HashtagController],
      providers: [
        {
          provide: HASHTAG_SERVICE,
          useClass: options,
        },
      ],
      imports: [
        RouterModule.register([
          {
            path,
            module: HashtagModule,
          },
        ]),
      ],
    };
  }
}
