import { ApiProperty } from '@nestjs/swagger';
import { MajorEntity } from '@src/modules/major/entities/major.entity';
import { Type } from 'class-transformer';

export class MajorsFindResponseBodyDto {
  @ApiProperty({
    description: '분야 리스트',
    type: [MajorEntity],
  })
  @Type(() => MajorEntity)
  majors: MajorEntity[];
}
