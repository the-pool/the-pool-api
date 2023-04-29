import { ArgumentMetadata, Injectable, ParseIntPipe } from '@nestjs/common';

@Injectable()
export class ParsePositiveIntPipe extends ParseIntPipe {
  constructor() {
    super();
  }

  async transform(value: string, metadata: ArgumentMetadata): Promise<number> {
    if (!this.isNumeric(value)) {
      throw this.exceptionFactory(
        'Validation failed (numeric string is expected)',
      );
    }

    if (Number(value) < 1) {
      throw this.exceptionFactory(
        'Validation failed (positive numeric string is expected)',
      );
    }

    return parseInt(value, 10);
  }
}
