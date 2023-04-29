import { Injectable } from '@nestjs/common';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { MemberStatisticsEvent } from '@src/modules/member-statistics/events/member-statistics.event';
import { CreateSolutionRequestBodyDto } from '@src/modules/solution/dtos/create-solution-request-body.dto';
import { LessonSolutionStatisticsResponseBodyDto } from '@src/modules/solution/dtos/lesson-solution-statistics-response-body.dto';
import { SolutionEntity } from '@src/modules/solution/entities/solution.entity';
import { LessonSolutionRepository } from '@src/modules/solution/repositories/lesson-solution.repository';

@Injectable()
export class SolutionService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly lessonSolutionRepository: LessonSolutionRepository,
    private readonly memberStatisticsEvent: MemberStatisticsEvent,
  ) {}

  async createSolution(
    requestDto: CreateSolutionRequestBodyDto,
    memberId: number,
  ): Promise<SolutionEntity> {
    const newSolution = await this.prismaService.lessonSolution.create({
      data: {
        ...requestDto,
        memberId,
      },
    });

    // member 의 lessonSolutionCount 증가 이벤트 등록
    this.memberStatisticsEvent.register(memberId, {
      fieldName: 'solutionCount',
      action: 'increment',
    });

    return newSolution;
  }

  async findStatisticsByMemberId(
    memberId: number,
  ): Promise<LessonSolutionStatisticsResponseBodyDto> {
    const statisticsList =
      await this.lessonSolutionRepository.findStatisticsByMemberId(memberId);

    return statisticsList[0];
  }
}
