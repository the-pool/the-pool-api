import { ApiProperty } from '@nestjs/swagger';
import { MajorEntity } from '@src/modules/major/entities/major.entity';

export class MajorsDto {
  @ApiProperty({
    description: '분야 리스트',
    type: [MajorEntity],
  })
  majors: MajorEntity[];
}
