import { Injectable } from '@nestjs/common';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { MajorEntity } from '@src/modules/major/entities/major.entity';
import { MajorsFindRequestQueryDto } from '../dto/majors-find-request-query.dto';

@Injectable()
export class MajorService {
  constructor(private readonly prismaService: PrismaService) {}

  findAll(query: MajorsFindRequestQueryDto): Promise<MajorEntity[]> {
    const { mainSkills } = query;

    return this.prismaService.major.findMany({
      include: {
        mainSkills,
      },
    });
  }
}
