import { Injectable } from '@nestjs/common';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { MajorSkillEntity } from '@src/modules/major/entities/major-skill.entity';
import { MajorEntity } from '@src/modules/major/entities/major.entity';
import { MajorRelationFieldRequestQueryDto } from '../dtos/major-relation-field-request-query.dto';

@Injectable()
export class MajorService {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * major 전체조회
   * 클라언트에게 받은 majorSKills: boolean 를 가지고 mainSkills 도 함께 가져온다.
   */
  findMajors(query: MajorRelationFieldRequestQueryDto): Promise<MajorEntity[]> {
    const { majorSkills } = query;

    return this.prismaService.major.findMany({
      include: {
        majorSkills,
      },
    });
  }

  /**
   * major 단일 조회
   * 클라언트에게 받은 majorSKills: boolean 를 가지고 mainSkills 도 함께 가져온다.
   */
  findMajor(
    majorId: number,
    query: MajorRelationFieldRequestQueryDto,
  ): Promise<MajorEntity> {
    const { majorSkills } = query;

    return this.prismaService.major.findUnique({
      where: {
        id: majorId,
      },
      include: {
        majorSkills,
      },
    }) as Promise<MajorEntity>;
  }

  /**
   * mainSkill 전체 조회
   * majorId 를 기준으로 mainSkill 을 가져온다.
   */
  findMainSkills(majorId: number): Promise<MajorSkillEntity[]> {
    return this.prismaService.majorSkill.findMany({
      where: {
        majorId,
      },
    });
  }

  /**
   * mainSkill 단일 조회
   * majorId 를 기준으로 mainSkill 을 가져온다.
   */
  findMainSkill(
    majorId: number,
    mainSkillId: number,
  ): Promise<MajorSkillEntity> {
    return this.prismaService.majorSkill.findUnique({
      where: {
        majorId,
        id: mainSkillId,
      },
    }) as Promise<MajorSkillEntity>;
  }
}
