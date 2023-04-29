import { ArgumentMetadata } from '@nestjs/common';
import { ParsePositiveIntPipe } from './parse-positive-int.pipe';

describe('ParsePositiveIntPipe', () => {
  let pipe: ParsePositiveIntPipe;

  beforeEach(() => {
    pipe = new ParsePositiveIntPipe();
  });

  it('should be defined', () => {
    expect(new ParsePositiveIntPipe()).toBeDefined();
  });

  it('negative string float number', async () => {
    await expect(
      pipe.transform('-1.1', {} as ArgumentMetadata),
    ).rejects.toThrowError();
  });

  it('negative string int number', async () => {
    await expect(
      pipe.transform('-1', {} as ArgumentMetadata),
    ).rejects.toThrowError();
  });
});
