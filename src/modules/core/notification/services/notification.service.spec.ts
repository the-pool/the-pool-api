import { faker } from '@faker-js/faker';
import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  EMBED_BUILDER_TOKEN,
  WEBHOOK_CLIENT_TOKEN,
} from '@src/modules/core/notification/constants/notification.constant';
import { NotificationService } from '@src/modules/core/notification/services/notification.service';
import {
  ServerExceptionField,
  WarningExceptionFiled,
} from '@src/modules/core/notification/type/notification.type';
import { ThePoolConfigService } from '@src/modules/core/the-pool-config/services/the-pool-config.service';
import { MockEmbedBuilder, MockWebhookClient } from '@test/mock/mock-libs';
import { mockThePoolConfigService } from '@test/mock/mock-services';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationService,
        {
          provide: EMBED_BUILDER_TOKEN,
          useValue: MockEmbedBuilder,
        },
        {
          provide: WEBHOOK_CLIENT_TOKEN,
          useValue: MockWebhookClient,
        },
        {
          provide: ThePoolConfigService,
          useValue: mockThePoolConfigService,
        },
      ],
    }).compile();

    service = module.get<NotificationService>(NotificationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('NotificationService', () => {
    describe('warning', () => {
      let warningExceptionFiled: WarningExceptionFiled;

      beforeEach(() => {
        warningExceptionFiled = {
          description: faker.random.word(),
        };
      });

      it('send', async () => {
        await expect(
          service.warning(warningExceptionFiled),
        ).resolves.toBeUndefined();
      });
    });

    describe('error', () => {
      let serverExceptionField: ServerExceptionField;

      beforeEach(() => {
        serverExceptionField = {
          name: faker.name.fullName(),
          method: 'POST',
          path: '/api',
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          body: faker.random.words(),
          stack: faker.datatype.string(),
        };
      });

      it('send', async () => {
        await expect(
          service.error(serverExceptionField),
        ).resolves.toBeUndefined();
      });
    });
  });
});
