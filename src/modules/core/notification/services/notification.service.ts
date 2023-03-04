import { Inject, Injectable, Type } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  EMBED_BUILDER_TOKEN,
  WEBHOOK_CLIENT_TOKEN,
} from '@src/modules/core/notification/constants/notification.constant';
import {
  ServerExceptionField,
  WarningExceptionFiled,
} from '@src/modules/core/notification/type/notification.type';
import { bold, EmbedBuilder, WebhookClient } from 'discord.js';

/**
 * 해당 파일에서만 쓰이는 타입
 */
interface Field {
  name: string;
  value: string;
  inline: boolean;
}

/**
 * 해당 파일에서만 쓰이는 타입
 */
interface NotificationOption {
  color: `#${string}`;
  title: string;
  fields?: Field[];
  description?: any;
}

@Injectable()
export class NotificationService {
  constructor(
    @Inject(EMBED_BUILDER_TOKEN)
    private readonly embedBuilder: Type<EmbedBuilder>,
    @Inject(WEBHOOK_CLIENT_TOKEN)
    private readonly webhookClient: Type<WebhookClient>,
    private readonly configService: ConfigService,
  ) {}

  /**
   * 400번대 에러 또는 인지해야하는 사항
   */
  async warning(exceptionField: WarningExceptionFiled): Promise<void> {
    const { description, ...serverExceptionField } = exceptionField;

    await this.send(this.configService.get('SERVER_EXCEPTION_CHANNEL_URL'), {
      description,
      color: '#FFA500', // 주황
      title: 'server warning exception',
      fields: this.buildServerExceptionField(serverExceptionField),
    });
  }

  /**
   * 500번대 에러 시
   */
  async error(exceptionField: ServerExceptionField): Promise<void> {
    await this.send(this.configService.get('SERVER_EXCEPTION_CHANNEL_URL'), {
      color: '#a63641', // 빨강
      title: 'server error exception',
      fields: this.buildServerExceptionField(exceptionField),
    });
  }

  private buildServerExceptionField(
    exceptionField: Partial<ServerExceptionField>,
  ): Field[] {
    const { name, method, path, status, body, stack } = exceptionField;
    const fields: Field[] = [];

    if (name) {
      fields.push({
        name: 'Exception name',
        value: name,
        inline: false,
      });
    }

    if (method) {
      fields.push({
        name: 'Method',
        value: method,
        inline: false,
      });
    }

    if (path) {
      fields.push({
        name: 'Path',
        value: path.slice(0, 1000),
        inline: true,
      });
    }

    if (status) {
      fields.push({
        name: 'Status',
        value: status.toString(),
        inline: true,
      });
    }

    if (body) {
      fields.push({
        name: 'Body',
        value: JSON.stringify(body).slice(0, 1000),
        inline: false,
      });
    }

    if (stack) {
      fields.push({
        name: 'Error Stack',
        value: JSON.stringify(stack).slice(0, 1000),
        inline: false,
      });
    }

    return fields;
  }

  /**
   * 실제 webhook 을 통해 보내는 메서드
   */
  private async send(url, option: NotificationOption): Promise<void> {
    const { title, color, description, fields } = option;

    const webhookClient = new this.webhookClient({
      url,
    });

    const embed = new this.embedBuilder()
      .setTitle(title)
      .setColor(color)
      .setTimestamp();

    if (fields && fields.length) {
      embed.setFields(...fields);
    }

    if (description) {
      embed.setDescription(description);
    }

    await webhookClient
      .send({
        username: 'thePool',
        content: bold('the pool server notification'),
        avatarURL: 'https://avatars.githubusercontent.com/u/113972423',
        embeds: [embed],
      })
      .catch((e) => {
        console.error(e);
      });
  }
}
