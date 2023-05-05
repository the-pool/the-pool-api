import { ErrorHttpStatusCode } from '@nestjs/common/utils/http-error-by-code.util';

export type ServerExceptionField = {
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | string;
  path: string;
  status: ErrorHttpStatusCode;
  body: any;
  stack: any;
};

export type WarningExceptionFiled = Partial<ServerExceptionField> & {
  description: string;
};

export interface Field {
  name: string;
  value: string;
  inline: boolean;
}

export interface NotificationOption {
  color: `#${string}`;
  title: string;
  fields?: Field[];
  description?: any;
}
