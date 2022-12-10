import { ApiPropertyOptional } from '@nestjs/swagger';
import { StringBooleanTransform } from '@src/common/common';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';

export class MajorRelationFieldRequestQueryDto {
  @ApiPropertyOptional({
    description: 'mainSKills 를 true 로 주면 response 의 majors 가 추가됩니다.',
    default: false,
    enum: ['true', 'false'],
  })
  @IsOptional()
  @IsBoolean()
  @Transform(StringBooleanTransform)
  mainSkills = false;
}
