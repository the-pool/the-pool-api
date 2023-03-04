import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IncreaseMemberSolutionCountInterceptor } from '@src/decorators/increase-member-solution-count.ineterceptor.decorator';
import { AllowMemberStatusesSetMetadataGuard } from '@src/decorators/member-statuses-set-metadata.guard-decorator';
import { UserLogin } from '@src/decorators/user-login.decorator';
import { JwtAuthGuard } from '@src/guards/jwt-auth.guard';
import { MemberStatus } from '@src/modules/member/constants/member.enum';
import { CreateSolutionRequestBodyDto } from '../dtos/create-solution-request-body.dto';
import { SolutionEntity } from '../entities/solution.entity';
import { SolutionService } from '../services/solution.service';
import { ApiCreateSolution } from './solution.controller.swagger';

@ApiTags('문제 - 풀이')
@Controller('api/solutions')
export class SolutionController {
  constructor(private readonly solutionService: SolutionService) {}

  @ApiCreateSolution('문제 - 풀이 생성')
  @IncreaseMemberSolutionCountInterceptor('increment')
  @AllowMemberStatusesSetMetadataGuard([MemberStatus.Active])
  @UseGuards(JwtAuthGuard)
  @Post()
  createSolution(
    @Body() requestDto: CreateSolutionRequestBodyDto,
    @UserLogin('id') memberId: number,
  ): Promise<SolutionEntity> {
    return this.solutionService.createSolution(requestDto, memberId);
  }
}
