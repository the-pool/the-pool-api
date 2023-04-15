import { Injectable } from '@nestjs/common';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { LessonSolutionStatisticsResponseBodyDto } from '@src/modules/solution/dtos/lesson-solution-statistics-response-body.dto';
import { LessonSolutionRepository } from '@src/modules/solution/repositories/lesson-solution.repository';
import { CreateSolutionRequestBodyDto } from '../dtos/create-solution-request-body.dto';
import { SolutionEntity } from '../entities/solution.entity';

@Injectable()
export class SolutionService {
  constructor(
    private readonly lessonSolutionRepository: LessonSolutionRepository,
    private readonly prismaService: PrismaService,
  ) {}

  createSolution(
    requestDto: CreateSolutionRequestBodyDto,
    memberId: number,
  ): Promise<SolutionEntity> {
    return this.prismaService.lessonSolution.create({
      data: {
        ...requestDto,
        memberId,
      },
    });
  }

  async findStatisticsByMemberId(
    memberId: number,
  ): Promise<LessonSolutionStatisticsResponseBodyDto> {
    const statisticsList =
      await this.lessonSolutionRepository.findStatisticsByMemberId(memberId);

    return statisticsList[0];
  }
}
