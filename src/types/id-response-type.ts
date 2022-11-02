import { ApiProperty } from '@nestjs/swagger';

export class IdResponseType {
  @ApiProperty({
    example: 1,
    description: '고유 id',
    required: true,
    type: 'number',
  })
  id: number;
}
