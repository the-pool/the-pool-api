import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ServerExceptionField } from '@src/modules/core/notification/type/notification.type';
import { bold, EmbedBuilder, WebhookClient } from 'discord.js';

/**
 * 해당 파일에서만 쓰이는 타입
 */
interface NotificationOption {
  color: `#${string}`;
  title: string;
  fields?: {
    name: string;
    value: string;
    inline: boolean;
  }[];
  error?: any;
}

@Injectable()
export class NotificationService {
  constructor(private readonly configService: ConfigService) {}

  /**
   * 500번대 에러 시
   */
  async error(exceptionField: ServerExceptionField): Promise<void> {
    const { name, method, path, status, body, stack } = exceptionField;

    await this.send(this.configService.get('SERVER_EXCEPTION_CHANNEL_URL'), {
      color: '#a63641',
      title: 'server error exception',
      fields: [
        {
          name: 'Exception name',
          value: name,
          inline: false,
        },
        {
          name: 'Method',
          value: method,
          inline: true,
        },
        {
          name: 'Path',
          value: path.slice(0, 1000),
          inline: true,
        },
        {
          name: 'Status',
          value: status.toString(),
          inline: true,
        },
        {
          name: 'Body',
          value: JSON.stringify(body).slice(0, 1000),
          inline: false,
        },
        {
          name: 'Error Stack',
          value: JSON.stringify(stack).slice(0, 1000),
          inline: false,
        },
      ],
    });
  }

  /**
   * 실제 webhook 을 통해 보내는 메서드
   */
  private async send(url, option: NotificationOption): Promise<void> {
    const { title, color, fields } = option;

    const webhookClient = new WebhookClient({
      url,
    });

    const embed = new EmbedBuilder()
      .setTitle(title)
      .setColor(color)
      .setFields(...fields)
      .setTimestamp();

    await webhookClient.send({
      username: 'thePool',
      content: bold('the pool server notification'),
      avatarURL: 'https://avatars.githubusercontent.com/u/113972423',
      embeds: [embed],
    });
  }
}
