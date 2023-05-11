import { BadRequestException, Injectable } from '@nestjs/common';
import {
  LessonSolutionHashtag,
  LessonSolutionHashtagMapping,
} from '@prisma/client';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { CreateSolutionHashtagsRequestBodyDto } from '@src/modules/solution/dtos/create-solution-hashtags-request-body.dto';

@Injectable()
export class SolutionHashtagService {
  constructor(private readonly prismaService: PrismaService) {}

  async createManyHashtag(
    solutionHashtags: CreateSolutionHashtagsRequestBodyDto,
    solutionId: number,
  ): Promise<LessonSolutionHashtag[]> {
    const existTags = (await this.findManyHashtag(solutionId)).map(
      (v) => v.lessonSolutionHashtag.tag,
    );
    const newTags = solutionHashtags.hashtags.filter(
      (v) => !existTags.includes(v),
    );

    // 해시태그 갯수 초과
    if (existTags.length + newTags.length > 5) {
      throw new BadRequestException(
        '등록 가능한 해시태그의 최대갯수는 5개입니다.',
      );
    }

    return Promise.all(
      newTags.map((tagName: string) => this.createHashtag(tagName, solutionId)),
    );
  }

  findManyHashtag(solutionId: number): Promise<
    (LessonSolutionHashtagMapping & {
      lessonSolutionHashtag: LessonSolutionHashtag;
    })[]
  > {
    return this.prismaService.lessonSolutionHashtagMapping.findMany({
      where: {
        lessonSolutionId: solutionId,
      },
      include: { lessonSolutionHashtag: true },
    });
  }

  // 해시태그 & 해시태그맵핑 생성
  private async createHashtag(
    tagName: string,
    solutionId: number,
  ): Promise<LessonSolutionHashtag> {
    return this.prismaService.lessonSolutionHashtag.create({
      data: {
        tag: tagName,
        lessonSolutionHashtagMappings: {
          create: { lessonSolutionId: solutionId },
        },
      },
    });
  }
}
