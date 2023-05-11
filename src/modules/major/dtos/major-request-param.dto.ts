import { IntersectionType } from '@nestjs/swagger';
import { MajorIdRequestParamDto } from '@src/modules/major/dtos/major-id-request-param.dto';
import { MajorSkillIdRequestParamDto } from '@src/modules/major/dtos/major-skill-id-request-param.dto';

export class MajorRequestParamDto extends IntersectionType(
  MajorIdRequestParamDto,
  MajorSkillIdRequestParamDto,
) {}
