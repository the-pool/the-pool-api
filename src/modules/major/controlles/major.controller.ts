import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  PickType,
} from '@nestjs/swagger';
import { MajorsDto } from '@src/modules/major/dto/majors.dto';
import { plainToInstance } from 'class-transformer';
import { number } from 'joi';
import { MainSkillDto } from '../dto/main-skill.dto';
import { MainSkillsDto } from '../dto/main-skills.dto';
import { MajorRequestParamDto } from '../dto/major-request-param.dto';
import { MajorDto } from '../dto/major.dto';
import { MajorsFindRequestQueryDto } from '../dto/majors-find-request-query.dto';
import { MajorService } from '../services/major.service';

@ApiTags('분야')
@Controller('api/majors')
export class MajorController {
  constructor(private readonly majorService: MajorService) {}

  @ApiOperation({ summary: '분야 리스트' })
  @ApiOkResponse({ type: MajorsDto })
  @Get()
  async findMajors(
    @Query() query: MajorsFindRequestQueryDto,
  ): Promise<MajorsDto> {
    const majors = await this.majorService.findMajors(query);

    return plainToInstance(MajorsDto, { majors });
  }

  @ApiOperation({ summary: '분야 단일 조회' })
  @ApiParam({
    type: PickType(MajorRequestParamDto, ['majorId']),
    name: ':majorId',
  })
  @ApiOkResponse({ type: MajorDto })
  @Get(':majorId')
  async findMajor(
    @Param() param: Pick<MajorRequestParamDto, 'majorId'>,
  ): Promise<MajorDto> {
    const major = await this.majorService.findMajor(param.majorId);

    return plainToInstance(MajorDto, { major });
  }

  @ApiOperation({ summary: '분야의 스킬 리스트 조회' })
  @ApiParam({
    type: PickType(MajorRequestParamDto, ['majorId']),
    name: ':majorId/mainSkills',
  })
  @ApiOkResponse({ type: MainSkillsDto })
  @Get(':majorId/mainSkills')
  async findMainSkills(
    @Param() param: Pick<MajorRequestParamDto, 'majorId'>,
  ): Promise<MainSkillsDto> {
    const mainSkills = await this.majorService.findMainSkills(param.majorId);

    return plainToInstance(MainSkillsDto, { mainSkills });
  }

  @ApiOperation({ summary: '분야의 스킬 단일 조회' })
  @ApiOkResponse({ type: MainSkillDto })
  @Get(':majorId/mainSkills/:mainSkillId')
  async findMainSkill(
    @Param() param: MajorRequestParamDto,
  ): Promise<MainSkillDto> {
    const mainSkill = await this.majorService.findMainSkill(
      param.majorId,
      param.mainSkillid,
    );

    return plainToInstance(MainSkillDto, { mainSkill });
  }
}
