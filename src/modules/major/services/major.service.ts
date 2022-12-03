import { Injectable } from '@nestjs/common';
import { MainSkill } from '@prisma/client';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { MajorEntity } from '@src/modules/major/entities/major.entity';
import { MajorsFindRequestQueryDto } from '../dto/majors-find-request-query.dto';

@Injectable()
export class MajorService {
  constructor(private readonly prismaService: PrismaService) {}

  findMajors(query: MajorsFindRequestQueryDto): Promise<MajorEntity[]> {
    const { mainSkills } = query;

    return this.prismaService.major.findMany({
      include: {
        mainSkills,
      },
    });
  }

  findMajor(majorId: number): Promise<MajorEntity> {}
  findMainSkills(majorId: number): Promise<MainSkill[]> {}
  findMainSkill(majorId: number, mainSkillId: number): Promise<MainSkill> {}
}
