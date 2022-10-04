import { ApiProperty } from '@nestjs/swagger';

export class AccessTokenType {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NTI1LCJpYXQiOjE2NjQ4OTA4ODcsImV4cCI6MTk4MDQ2Njg4N30.BRWIIE2pv1L0lzmw4KlCqRZZZo3CT8bsgHekpfzUe38',
    description: 'user accessToken',
    required: true,
    type: 'string',
  })
  accessToken?: string;
}
