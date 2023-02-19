import { ApiProperty } from '@nestjs/swagger';
import {
  transformCsvToArray,
  transformEachStrungToNumber,
  transformEachTrim,
} from '@src/common/common';
import { ModelName } from '@src/constants/enum';
import { IsRecordMany } from '@src/decorators/is-record-many.decorator';
import { IdRequestParamDto } from '@src/dtos/id-request-param.dto';
import { MemberSkillEntity } from '@src/modules/member-skill/entities/member-skill.entity';
import { Transform } from 'class-transformer';
import { ArrayUnique, IsInt, Min } from 'class-validator';

export class CreateMemberInterestMappingRequestParamDto extends IdRequestParamDto {
  @ApiProperty({
    description:
      'member interest 고유 ID</br>CSV 형태로 보내줘야합니다.</br>, 기준으로 앞뒤 공백 제거한 뒤 유효성 검사 진행합니다.',
    example: '1,2,3',
    minimum: 1,
    uniqueItems: true,
    type: () => String,
  })
  @IsRecordMany<MemberSkillEntity>(
    { model: ModelName.MemberInterest, field: 'id' },
    true,
  )
  @Min(1, { each: true })
  @IsInt({ each: true })
  @ArrayUnique()
  @Transform(transformCsvToArray)
  @Transform(transformEachTrim)
  @Transform(transformEachStrungToNumber)
  memberInterestIds: number[];
}
