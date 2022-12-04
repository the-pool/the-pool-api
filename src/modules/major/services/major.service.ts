import { Injectable } from '@nestjs/common';
import { MainSkill } from '@prisma/client';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { MajorEntity } from '@src/modules/major/entities/major.entity';
import { MajorRelationFieldRequestQueryDto } from '../dto/major-relation-field-request-query.dto';

@Injectable()
export class MajorService {
  constructor(private readonly prismaService: PrismaService) {}

  findMajors(query: MajorRelationFieldRequestQueryDto): Promise<MajorEntity[]> {
    const { mainSkills } = query;

    return this.prismaService.major.findMany({
      include: {
        mainSkills,
      },
    });
  }

  findMajor(
    majorId: number,
    query: MajorRelationFieldRequestQueryDto,
  ): Promise<MajorEntity> {
    const { mainSkills } = query;

    return this.prismaService.major.findUnique({
      where: {
        id: majorId,
      },
      include: {
        mainSkills,
      },
    });
  }

  findMainSkills(majorId: number): Promise<MainSkill[]> {
    return this.prismaService.mainSkill.findMany({
      where: {
        majorId,
      },
    });
  }

  findMainSkill(majorId: number, mainSkillId: number): Promise<MainSkill> {
    return this.prismaService.mainSkill.findUnique({
      where: {
        majorId,
        id: mainSkillId,
      },
    });
  }
}
