import { IntersectionType } from '@nestjs/swagger';
import { MajorIdRequestParamDto } from './major-id-request-param.dto';
import { MajorSkillIdRequestParamDto } from './major-skill-id-request-param.dto';

export class MajorRequestParamDto extends IntersectionType(
  MajorIdRequestParamDto,
  MajorSkillIdRequestParamDto,
) {}
