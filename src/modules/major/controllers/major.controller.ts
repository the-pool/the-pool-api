import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MajorListDto } from '@src/modules/major/dtos/majorListDto';
import { MainSkillEntity } from '@src/modules/major/entities/main-skill.entity';
import { MajorEntity } from '@src/modules/major/entities/major.entity';
import { plainToInstance } from 'class-transformer';
import { MainSkillListDto } from '../dtos/main-skill-list.dto';
import { MainSkillDto } from '../dtos/main-skill.dto';
import { MajorIdRequestParamDto } from '../dtos/major-id-request-param.dto';
import { MajorRelationFieldRequestQueryDto } from '../dtos/major-relation-field-request-query.dto';
import { MajorRequestParamDto } from '../dtos/major-request-param.dto';
import { MajorDto } from '../dtos/major.dto';
import { MajorService } from '../services/major.service';

@ApiTags('분야')
@Controller('api/majors')
export class MajorController {
  constructor(private readonly majorService: MajorService) {}

  @ApiOperation({ summary: '분야 리스트 조회' })
  @ApiOkResponse({ type: MajorListDto })
  @Get()
  async findMajors(
    @Query() query: MajorRelationFieldRequestQueryDto,
  ): Promise<MajorListDto> {
    const majors: MajorEntity[] = await this.majorService.findMajors(query);

    return plainToInstance(MajorListDto, { majors });
  }

  @ApiOperation({ summary: '분야 단일 조회' })
  @ApiOkResponse({ type: MajorDto })
  @Get(':majorId')
  async findMajor(
    @Param() param: MajorIdRequestParamDto,
    @Query() query: MajorRelationFieldRequestQueryDto,
  ): Promise<MajorDto> {
    const major: MajorEntity = await this.majorService.findMajor(
      param.majorId,
      query,
    );

    return plainToInstance(MajorDto, { major });
  }

  @ApiOperation({ summary: '분야의 스킬 리스트 조회' })
  @ApiOkResponse({ type: MainSkillListDto })
  @Get(':majorId/mainSkills')
  async findMainSkills(
    @Param() param: MajorIdRequestParamDto,
  ): Promise<MainSkillListDto> {
    const mainSkills: MainSkillEntity[] =
      await this.majorService.findMainSkills(param.majorId);

    return plainToInstance(MainSkillListDto, { mainSkills });
  }

  @ApiOperation({ summary: '분야의 스킬 단일 조회' })
  @ApiOkResponse({ type: MainSkillDto })
  @Get(':majorId/mainSkills/:mainSkillId')
  async findMainSkill(
    @Param() param: MajorRequestParamDto,
  ): Promise<MainSkillDto> {
    const mainSkill: MainSkillEntity = await this.majorService.findMainSkill(
      param.majorId,
      param.mainSkillId,
    );

    return plainToInstance(MainSkillDto, { mainSkill });
  }
}
