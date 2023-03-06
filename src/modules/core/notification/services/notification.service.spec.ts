import { faker } from '@faker-js/faker';
import { HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import {
  EMBED_BUILDER_TOKEN,
  WEBHOOK_CLIENT_TOKEN,
} from '@src/modules/core/notification/constants/notification.constant';
import {
  ServerExceptionField,
  WarningExceptionFiled,
} from '@src/modules/core/notification/type/notification.type';
import {
  MockEmbedBuilder,
  MockWebhookClient,
} from '../../../../../test/mock/mock-libs';
import { mockConfigService } from '../../../../../test/mock/mock-services';
import { NotificationService } from './notification.service';

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
          provide: ConfigService,
          useValue: mockConfigService,
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
