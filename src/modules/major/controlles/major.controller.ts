import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MajorsFindResponseBodyDto } from '@src/modules/major/dto/majors-find-response-body.dto';
import { plainToInstance } from 'class-transformer';
import { MajorRequestParamDto } from '../dto/major-request-param.dto';
import { MajorsFindRequestQueryDto } from '../dto/majors-find-request-query.dto';
import { MajorService } from '../services/major.service';

@ApiTags('분야')
@Controller('api/majors')
export class MajorController {
  constructor(private readonly majorService: MajorService) {}

  @ApiOperation({ summary: '분야 리스트' })
  @ApiOkResponse({ type: MajorsFindResponseBodyDto })
  @Get()
  async findMajors(
    @Query() query: MajorsFindRequestQueryDto,
  ): Promise<MajorsFindResponseBodyDto> {
    const majors = await this.majorService.findMajors(query);

    return plainToInstance(MajorsFindResponseBodyDto, { majors });
  }

  @Get(':majorId')
  async findMajor(@Param() param: Pick<MajorRequestParamDto, 'majorId'>) {}

  @Get(':majorId/mainSkills')
  async findMainSkills(@Param() param: Pick<MajorRequestParamDto, 'majorId'>) {}

  @Get(':majorId/mainSkills/:mainSkillId')
  async findMainSkill(@Param() param: MajorRequestParamDto) {}
}
