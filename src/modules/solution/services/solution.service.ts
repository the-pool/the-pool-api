import { Injectable } from '@nestjs/common';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { CreateSolutionRequestBodyDto } from '../dtos/create-solution-request-body.dto';
import { SolutionEntity } from '../entities/solution.entity';



@Injectable()
export class SolutionService {
  constructor(
    private readonly prismaService: PrismaService
  ) { }

  createSolution(
    requestDto: CreateSolutionRequestBodyDto,
    memberId: number
  ): Promise<SolutionEntity> {
    return this.prismaService.lessonSolution.create({
      data: {
        ...requestDto,
        memberId
      }
    })
  }
}