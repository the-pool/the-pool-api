import { ApiProperty } from '@nestjs/swagger';

import { IdRequestParamDto } from '@src/dtos/id-request-param.dto';
import { Transform } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class LessonHashtagParamDto extends IdRequestParamDto {
  @ApiProperty({
    description: '특정 과제의 해시태그 고유 ID',
    example: '1,2,3,4',
  })
  @Min(1, { each: true })
  @IsInt({ each: true })
  @Transform(({ value }) => {
    return value.split(',').map((id: string) => Number(id));
  })
  lessonHashtagIds: number[];
}
