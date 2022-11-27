import { Injectable } from '@nestjs/common';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { MajorEntity } from '@src/modules/major/entities/major.entity';

@Injectable()
export class MajorService {
  constructor(private readonly prismaService: PrismaService) {}

  findAll(): Promise<MajorEntity[]> {
    return this.prismaService.major.findMany();
  }
}
