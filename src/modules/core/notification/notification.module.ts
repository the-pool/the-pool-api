import { Module } from '@nestjs/common';
import {
  EMBED_BUILDER_TOKEN,
  WEBHOOK_CLIENT_TOKEN,
} from '@src/modules/core/notification/constants/notification.constant';
import { EmbedBuilder, WebhookClient } from 'discord.js';
import { NotificationService } from './services/notification.service';

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
export class NotificationModule {}
