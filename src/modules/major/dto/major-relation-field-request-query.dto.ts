import { ApiPropertyOptional } from '@nestjs/swagger';
import { StringBooleanTransform } from '@src/common/common';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';

export class MajorRelationFieldRequestQueryDto {
  @ApiPropertyOptional({
    default: false,
    enum: ['true', 'false'],
  })
  @IsOptional()
  @IsBoolean()
  @Transform(StringBooleanTransform)
  mainSkills: boolean = false;
}
