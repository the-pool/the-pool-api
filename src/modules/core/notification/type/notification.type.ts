import { ErrorHttpStatusCode } from '@nestjs/common/utils/http-error-by-code.util';

export type ServerExceptionField = {
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | string;
  path: string;
  status: ErrorHttpStatusCode;
  body: any;
  stack: any;
};
