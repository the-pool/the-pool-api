import { ApiProperty } from '@nestjs/swagger';
import { Major } from '@prisma/client';
import {
  transformCsvToArray,
  transformEachStrungToNumber,
  transformEachTrim,
} from '@src/common/common';
import { IsRecord } from '@src/decorators/is-record.decorator';
import { IdRequestParamDto } from '@src/dtos/id-request-param.dto';
import { Transform, Type } from 'class-transformer';
import { ArrayUnique, IsInt, Min } from 'class-validator';

export class CreateMemberMajorSkillMappingRequestParamDto extends IdRequestParamDto {
  @ApiProperty({
    description: 'major 고유 ID',
    minimum: 1,
  })
  @IsRecord<Major>({ model: 'major', field: 'id' }, true)
  @Min(1)
  @IsInt()
  @Type(() => Number)
  majorId: number;

  @ApiProperty({
    description:
      'major skill 고유 ID</br>CSV 형태로 보내줘야합니다.</br>, 기준으로 앞뒤 공백 제거한 뒤 유효성 검사 진행합니다.',
    example: '1, 2, 3',
    minimum: 1,
    uniqueItems: true,
    type: () => Number,
  })
  @Min(1, { each: true })
  @IsInt({ each: true })
  @ArrayUnique()
  @Transform(transformCsvToArray)
  @Transform(transformEachTrim)
  @Transform(transformEachStrungToNumber)
  majorSkillIds: number[];
}
