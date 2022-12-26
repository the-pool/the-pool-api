import { DynamicModule, Module, UseInterceptors } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { DataStructureHelper } from '@src/helpers/data-structure.helper';
import { PrismaHelper } from '../core/database/prisma/prisma.helper';
import { PrismaService } from '../core/database/prisma/prisma.service';
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
        PrismaService,
        PrismaHelper,
        DataStructureHelper,
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
