import { Body, Controller, Get, InternalServerErrorException, Post, UseGuards } from '@nestjs/common';
import { ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiTags } from '@nestjs/swagger';
import { UserLogin } from '@src/decorators/user-login.decorator';
import { JwtAuthGuard } from '@src/guards/jwt-auth.guard';
import { NotFoundResponseType } from '@src/types/not-found-response.type';
import { CreateSolutionRequestBodyDto } from '../dtos/create-solution-request-body.dto';
import { SolutionEntity } from '../entities/solution.entity';
import { SolutionService } from '../services/solution.service';
import { ApiCreateSolution } from './solution.controller.swagger';

@ApiTags('문제 - 풀이')
@Controller('api/solutions')
export class SolutionController {
  constructor(
    private readonly solutionService: SolutionService
  ) { }

  @ApiCreateSolution('문제 - 풀이 생성')
  @UseGuards(JwtAuthGuard)
  @Post()
  createSolution(
    @Body() requestDto: CreateSolutionRequestBodyDto,
    @UserLogin('id') memberId: number
  ): Promise<SolutionEntity> {
    return this.solutionService.createSolution(
      requestDto, memberId
    );
  }
}