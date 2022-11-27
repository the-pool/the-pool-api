import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MajorsFindResponseBodyDto } from '@src/modules/major/dto/majors-find-response-body.dto';
import { plainToInstance } from 'class-transformer';
import { MajorService } from '../services/major.service';

@ApiTags('분야')
@Controller('api/majors')
export class MajorController {
  constructor(private readonly majorService: MajorService) {}

  @ApiOperation({ summary: '분야 리스트' })
  @ApiOkResponse({ type: MajorsFindResponseBodyDto })
  @Get()
  async findAll(): Promise<MajorsFindResponseBodyDto> {
    const majors = await this.majorService.findAll();

    return plainToInstance(MajorsFindResponseBodyDto, { majors });
  }
}
