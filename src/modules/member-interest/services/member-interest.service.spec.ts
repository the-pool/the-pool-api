import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { MemberInterestEntity } from '@src/modules/member/entities/member-interest.entity';
import { mockPrismaService } from '../../../../test/mock/mock-prisma-service';
import { MemberInterestService } from './member-interest.service';

describe('MemberInterestService', () => {
  let service: MemberInterestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MemberInterestService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<MemberInterestService>(MemberInterestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    let memberInterests: MemberInterestEntity;
    let memberId: number;

    beforeEach(() => {
      memberInterests = new MemberInterestEntity();
    });

    it('memberId 를 넘기지 않았을 경우', async () => {
      mockPrismaService.memberInterest.findMany.mockReturnValue(
        memberInterests as any,
      );

      const result = await service.findAll(memberId);

      expect(mockPrismaService.memberInterest.findMany).toBeCalledWith({
        where: undefined,
        orderBy: {
          id: 'asc',
        },
      });
      expect(result).toStrictEqual({
        memberInterests,
      });
    });

    it('memberId 를 넘겼을 경우', async () => {
      memberId = faker.datatype.number({ min: 1 });
      mockPrismaService.memberInterest.findMany.mockReturnValue(
        memberInterests as any,
      );

      const result = await service.findAll(memberId);

      expect(mockPrismaService.memberInterest.findMany).toBeCalledWith({
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
        memberInterests,
      });
    });
  });
});
