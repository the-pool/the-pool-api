import { ApiProperty } from '@nestjs/swagger';
import { Major, MajorSkill } from '@prisma/client';
import { ModelName } from '@src/constants/enum';
import { IsRecord } from '@src/decorators/is-record.decorator';
import { IdRequestParamDto } from '@src/dtos/id-request-param.dto';
import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class CreateMemberMajorMappingRequestParamDto extends IdRequestParamDto {
  @ApiProperty({
    description: 'major 고유 ID',
  })
  @IsRecord<Major>({ model: 'major', field: 'id' }, true)
  @Min(1)
  @IsInt()
  @Type(() => Number)
  majorId: number;

  @ApiProperty({
    description: 'major 고유 ID',
  })
  @IsRecord<MajorSkill>({ model: ModelName.MajorSkill, field: 'id' }, true)
  @Min(1)
  @IsInt()
  @Type(() => Number)
  majorSkillId: number;
}
