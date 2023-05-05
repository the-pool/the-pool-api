import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SetResponseSetMetadataInterceptor } from '@src/decorators/set-response-set-metadata.interceptor-decorator';
import {
  ApiFindOneMajor,
  ApiFindAllMajor,
  ApiFindOneMajorSkill,
  ApiFindAllMajorSkill,
} from '@src/modules/major/controllers/major.swagger';
import { MajorSkillDto } from '@src/modules/major/dtos/major-skill-dto';
import { MajorDto } from '@src/modules/major/dtos/major.dto';
import { MajorIdRequestParamDto } from '../dtos/major-id-request-param.dto';
import { MajorRelationFieldRequestQueryDto } from '../dtos/major-relation-field-request-query.dto';
import { MajorRequestParamDto } from '../dtos/major-request-param.dto';
import { MajorService } from '../services/major.service';

@ApiTags('분야')
@Controller('api/majors')
export class MajorController {
  constructor(private readonly majorService: MajorService) {}

  @ApiFindAllMajor('분야 리스트 조회')
  @SetResponseSetMetadataInterceptor('majors')
  @Get()
  findAllMajor(
    @Query() query: MajorRelationFieldRequestQueryDto,
  ): Promise<MajorDto[]> {
    return this.majorService.findAllMajor(query);
  }

  @ApiFindOneMajor('분야 단일 조회')
  @SetResponseSetMetadataInterceptor('major')
  @Get(':majorId')
  findOneMajor(
    @Param() param: MajorIdRequestParamDto,
    @Query() query: MajorRelationFieldRequestQueryDto,
  ): Promise<MajorDto> {
    return this.majorService.findOneMajorOrThrow(param.majorId, query);
  }

  @ApiFindAllMajorSkill('분야의 스킬 리스트 조회')
  @SetResponseSetMetadataInterceptor('majorSkills')
  @Get(':majorId/majorSkills')
  findAllMajorSkill(
    @Param() param: MajorIdRequestParamDto,
  ): Promise<MajorSkillDto[]> {
    return this.majorService.findAllMajorSkill(param.majorId);
  }

  @ApiFindOneMajorSkill('분야의 스킬 단일 조회')
  @SetResponseSetMetadataInterceptor('majorSkill')
  @Get(':majorId/majorSkills/:majorSkillId')
  async findOneMajorSkill(
    @Param() param: MajorRequestParamDto,
  ): Promise<MajorSkillDto> {
    return this.majorService.findOneMajorSkillOrThrow(
      param.majorId,
      param.majorSkillId,
    );
  }
}
