import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import {
  EMBED_BUILDER_TOKEN,
  WEBHOOK_CLIENT_TOKEN,
} from '@src/modules/core/notification/constants/notification.constant';
import { NotificationService } from '@src/modules/core/notification/services/notification.service';
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

    const notificationService =
      this.moduleRef.get<NotificationService>(NotificationService);

    await notificationService
      .send(
        this.thePoolConfigService.get<string>(
          ENV_KEY.NORMAL_NOTIFICATION_CHANNEL_URL,
        ),
        {
          color: '#33FF68', // 연두
          title: 'Build Success',
          description: 'Current Environment Variable List',
          fields: Object.entries(this.thePoolConfigService.getAllMap()).map(
            ([key, value]) => {
              return {
                name: key,
                value: String(value),
                inline: false,
              };
            },
          ),
        },
      )
      .catch((e) => {
        console.error(e);
      });
  }
}
