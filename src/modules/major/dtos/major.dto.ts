import { ApiProperty } from '@nestjs/swagger';
import { MajorEntity } from '@src/modules/major/entities/major.entity';
import { Type } from 'class-transformer';

export class MajorDto {
  @ApiProperty({
    description: '분야',
    type: MajorEntity,
  })
  @Type(() => MajorEntity)
  major: MajorEntity;
}
