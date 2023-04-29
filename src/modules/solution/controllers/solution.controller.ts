import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BearerAuth } from '@src/decorators/bearer-auth.decorator';
import { AllowMemberStatusesSetMetadataGuard } from '@src/decorators/member-statuses-set-metadata.guard-decorator';
import { UserLogin } from '@src/decorators/user-login.decorator';
import { JwtAuthGuard } from '@src/guards/jwt-auth.guard';
import { MemberStatus } from '@src/modules/member/constants/member.enum';
import { ApiCreateSolution } from '@src/modules/solution/controllers/solution.controller.swagger';
import { CreateSolutionRequestBodyDto } from '@src/modules/solution/dtos/create-solution-request-body.dto';
import { SolutionEntity } from '@src/modules/solution/entities/solution.entity';
import { SolutionService } from '@src/modules/solution/services/solution.service';

@ApiTags('문제 - 풀이')
@Controller()
export class SolutionController {
  constructor(private readonly solutionService: SolutionService) {}

  @ApiCreateSolution('문제 - 풀이 생성')
  @AllowMemberStatusesSetMetadataGuard([MemberStatus.Active])
  @BearerAuth(JwtAuthGuard)
  @Post()
  createSolution(
    @Body() requestDto: CreateSolutionRequestBodyDto,
    @UserLogin('id') memberId: number,
  ): Promise<SolutionEntity> {
    return this.solutionService.createSolution(requestDto, memberId);
  }
}
