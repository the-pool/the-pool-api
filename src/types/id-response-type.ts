import { ApiProperty } from '@nestjs/swagger';

export class IdResponseType {
  @ApiProperty({
    example: 1,
    description: 'user 고유 id',
    required: true,
    type: 'string',
  })
  id: number;
}
