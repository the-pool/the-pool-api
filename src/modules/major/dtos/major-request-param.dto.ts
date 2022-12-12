import { IntersectionType } from '@nestjs/swagger';
import { MainSkillIdRequestParamDto } from './main-skill-id-request-param.dto';
import { MajorIdRequestParamDto } from './major-id-request-param.dto';

export class MajorRequestParamDto extends IntersectionType(
  MajorIdRequestParamDto,
  MainSkillIdRequestParamDto,
) {}
