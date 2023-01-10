import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { MemberSkillEntity } from '@src/modules/member-skill/entities/member-skill.entity';
import { mockPrismaService } from '../../../../test/mock/mock-prisma-service';
import { MemberSkillService } from './member-skill.service';

describe('MemberSkillService', () => {
  let service: MemberSkillService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MemberSkillService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<MemberSkillService>(MemberSkillService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    let memberSkills: MemberSkillEntity;
    let memberId: number;

    beforeEach(() => {
      memberSkills = new MemberSkillEntity();
    });

    it('memberId 를 넘기지 않았을 경우', async () => {
      mockPrismaService.memberSkill.findMany.mockReturnValue(
        memberSkills as any,
      );

      const result = await service.findAll(memberId);

      expect(mockPrismaService.memberSkill.findMany).toBeCalledWith({
        where: undefined,
        orderBy: {
          id: 'asc',
        },
      });
      expect(result).toStrictEqual({
        memberSkills,
      });
    });

    it('memberId 를 넘겼을 경우', async () => {
      memberId = faker.datatype.number({ min: 1 });
      mockPrismaService.memberSkill.findMany.mockReturnValue(
        memberSkills as any,
      );

      const result = await service.findAll(memberId);

      expect(mockPrismaService.memberSkill.findMany).toBeCalledWith({
        where: {
          memberSkillMappings: {
            some: {
              memberId,
            },
          },
        },
        orderBy: {
          id: 'asc',
        },
      });
      expect(result).toStrictEqual({
        memberSkills,
      });
    });
  });
});
