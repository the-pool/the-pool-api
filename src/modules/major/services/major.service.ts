import { Injectable } from '@nestjs/common';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { MajorRelationFieldRequestQueryDto } from '@src/modules/major/dtos/major-relation-field-request-query.dto';
import { MajorSkillDto } from '@src/modules/major/dtos/major-skill-dto';
import { MajorDto } from '@src/modules/major/dtos/major.dto';

@Injectable()
export class MajorService {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * major 전체조회
   * 클라언트에게 받은 majorSKills: boolean 를 가지고 MajorSkills 도 함께 가져온다.
   */
  findAllMajor(query: MajorRelationFieldRequestQueryDto): Promise<MajorDto[]> {
    const { majorSkills } = query;

    return this.prismaService.major.findMany({
      include: {
        majorSkills,
      },
    });
  }

  /**
   * major 단일 조회
   * 클라언트에게 받은 majorSKills: boolean 를 가지고 MajorSkills 도 함께 가져온다.
   */
  findOneMajorOrThrow(
    majorId: number,
    query: MajorRelationFieldRequestQueryDto,
  ): Promise<MajorDto> {
    const { majorSkills } = query;

    return this.prismaService.major.findUniqueOrThrow({
      where: {
        id: majorId,
      },
      include: {
        majorSkills,
      },
    });
  }

  /**
   * mainSkill 전체 조회
   * majorId 를 기준으로 MajorSkill 을 가져온다.
   */
  findAllMajorSkill(majorId: number): Promise<MajorSkillDto[]> {
    return this.prismaService.majorSkill.findMany({
      where: {
        majorId,
      },
    });
  }

  /**
   * mainSkill 단일 조회
   * majorId 를 기준으로 MajorSkill 을 가져온다.
   */
  findOneMajorSkillOrThrow(
    majorId: number,
    mainSkillId: number,
  ): Promise<MajorSkillDto> {
    return this.prismaService.majorSkill.findUniqueOrThrow({
      where: {
        majorId,
        id: mainSkillId,
      },
    });
  }
}
