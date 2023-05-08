import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import {
  EMBED_BUILDER_TOKEN,
  WEBHOOK_CLIENT_TOKEN,
} from '@src/modules/core/notification/constants/notification.constant';
import { NotificationService } from '@src/modules/core/notification/services/notification.service';
import { Field } from '@src/modules/core/notification/type/notification.type';
import { ENV_KEY } from '@src/modules/core/the-pool-config/constants/the-pool-config.constant';
import { ThePoolConfigService } from '@src/modules/core/the-pool-config/services/the-pool-config.service';
import { EmbedBuilder, WebhookClient } from 'discord.js';

@Module({
  providers: [
    NotificationService,
    {
      provide: EMBED_BUILDER_TOKEN,
      useValue: EmbedBuilder,
    },
    {
      provide: WEBHOOK_CLIENT_TOKEN,
      useValue: WebhookClient,
    },
  ],
  exports: [NotificationService],
})
export class NotificationModule implements OnApplicationBootstrap {
  constructor(
    private readonly moduleRef: ModuleRef,
    private readonly thePoolConfigService: ThePoolConfigService,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    const isLocal = this.thePoolConfigService.isLocal();

    if (isLocal) {
      return;
    }

    const envs = Object.entries(this.thePoolConfigService.getAllMap());

    const notificationService =
      this.moduleRef.get<NotificationService>(NotificationService);

    const maskedEnvFields: Field[] = envs.map(([key, value]) => {
      const maskedValue: string = [...String(value)]
        .map((str, idx) => {
          if (idx % 3 === 2) {
            return String(str);
          }
          return '\\*';
        })
        .join('');

      return {
        name: key,
        value: maskedValue,
        inline: false,
      };
    });

    await notificationService
      .send(
        this.thePoolConfigService.get<string>(
          ENV_KEY.NORMAL_NOTIFICATION_CHANNEL_URL,
        ),
        {
          color: '#33FF68', // 연두
          title: 'Build Success',
          description: 'Current Environment Variable List',
          fields: maskedEnvFields,
        },
      )
      .catch((e) => {
        console.error(e);
      });
  }
}
