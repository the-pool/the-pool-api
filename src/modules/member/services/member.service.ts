import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Member, Prisma } from '@prisma/client';
import { CommonHelper } from '@src/helpers/common.helper';
import { AuthService } from '@src/modules/core/auth/services/auth.service';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { MajorSkillEntity } from '@src/modules/major/entities/major-skill.entity';
import { MemberLoginType } from '@src/modules/member/constants/member.enum';
import { CreateMemberInterestMappingRequestParamDto } from '@src/modules/member/dtos/create-member-interest-mapping.request-param.dto';
import { CreateMemberSkillsMappingRequestParamDto } from '@src/modules/member/dtos/create-member-skills-mapping-request-param.dto';
import { DeleteMemberInterestMappingRequestParamDto } from '@src/modules/member/dtos/delete-member-interest-mapping.request-param.dto';
import { DeleteMemberSkillsMappingRequestParamDto } from '@src/modules/member/dtos/delete-member-skills-mapping-request-param.dto';
import { PatchUpdateMemberRequestBodyDto } from '@src/modules/member/dtos/patch-update-member-request-body.dto';
import { MemberInterestMappingEntity } from '@src/modules/member/entities/member-interest-mapping.entity';
import { MemberSkillMappingEntity } from '@src/modules/member/entities/member-skill-mapping.entity';
import { MemberSocialLinkMappingEntity } from '@src/modules/member/entities/member-social-link-mapping.entity';
import { AccessToken } from '@src/modules/member/types/member.type';
import { LessonSolutionStatisticsResponseBodyDto } from '@src/modules/solution/dtos/lesson-solution-statistics-response-body.dto';
import { SolutionService } from '@src/modules/solution/services/solution.service';
import { LoginByOAuthDto } from '../dtos/create-member-by-oauth.dto';
import { CreateMemberMajorSkillMappingRequestParamDto } from '../dtos/create-member-major-skill-mapping-request-param.dto';
import { LastStepLoginDto } from '../dtos/last-step-login.dto';
import { MemberSocialLinkDto } from '../dtos/member-social-link.dto';
import { MemberMajorMappingEntity } from '../entities/member-major-mapping.entity';
import { MemberEntity } from '../entities/member.entity';

@Injectable()
export class MemberService {
  constructor(
    private readonly solutionService: SolutionService,
    private readonly prismaService: PrismaService,
    private readonly authService: AuthService,
    private readonly commonHelper: CommonHelper,
  ) {}

  /**
   * member 단일조회
   */
  findOne(where: Prisma.MemberWhereInput) {
    return this.prismaService.member.findFirst({
      where,
      include: {
        memberSocialLinkMappings: true,
      },
    });
  }

  /**
   * member 단일 조회 없을 때 실패를 반환홤
   */
  async findOneOrFail(where: Prisma.MemberWhereInput): Promise<
    MemberEntity & {
      memberSocialLinkMappings: MemberSocialLinkMappingEntity[];
    }
  > {
    const member = await this.prismaService.member.findFirst({
      where,
      include: {
        memberSocialLinkMappings: true,
      },
    });

    if (!member) {
      throw new NotFoundException('존재하지 않는 member 입니다.');
    }

    return member;
  }

  /**
   * member 과제 통계 조회
   */
  async findLessonSolutionStatisticsById(
    memberId: number,
  ): Promise<LessonSolutionStatisticsResponseBodyDto> {
    return this.solutionService.findStatisticsByMemberId(memberId);
  }

  /**
   * member signUp
   */
  async signUp(
    account: string,
    loginType: MemberLoginType,
  ): Promise<{ member: MemberEntity } & AccessToken> {
    // 새로운 멤버 생성
    const newMember: MemberEntity = await this.prismaService.member.create({
      data: {
        account,
        loginType,
        memberStatistics: {
          create: {},
        },
      },
    });

    // access token 생성
    const accessToken: string = this.authService.createAccessToken(
      newMember.id,
    );

    return {
      accessToken,
      member: newMember,
    };
  }

  /**
   * member login
   */
  login(member: MemberEntity): { member: MemberEntity } & AccessToken {
    // access token 생성
    const accessToken: string = this.authService.createAccessToken(member.id);

    return {
      accessToken,
      member,
    };
  }

  /**
   * member patch update
   */
  async updateFromPatch(
    id: number,
    member: Omit<PatchUpdateMemberRequestBodyDto, 'memberSocialLinks'>,
    memberSocialLinks: MemberSocialLinkDto[] = [],
  ): Promise<
    MemberEntity & { memberSocialLinkMappings: MemberSocialLinkMappingEntity[] }
  > {
    const memberSocialLinkMappings = memberSocialLinks.map(
      (memberSocialLink) => {
        return {
          memberId: id,
          memberSocialLinkId: memberSocialLink.type,
          url: memberSocialLink.url,
        };
      },
    );

    return this.prismaService.$transaction(async (tr) => {
      if (memberSocialLinkMappings.length) {
        await tr.memberSocialLinkMapping.deleteMany({
          where: {
            memberId: id,
          },
        });

        await tr.memberSocialLinkMapping.createMany({
          data: memberSocialLinkMappings,
          skipDuplicates: true,
        });
      }

      return tr.member.update({
        data: member,
        where: {
          id,
        },
        include: {
          memberSocialLinkMappings: true,
        },
      });
    });
  }

  /**
   * member 와 major 를 매핑
   */
  mappingMajor(memberId: number, majorId: number) {
    return this.prismaService.member.update({
      data: {
        majorId,
      },
      where: {
        id: memberId,
      },
      include: {
        major: true,
      },
    });
  }

  /**
   * member 와 majorSkill 을 매핑
   */
  async mappingMajorSkill(
    member: MemberEntity,
    params: CreateMemberMajorSkillMappingRequestParamDto,
  ): Promise<{ count: number }> {
    // 현재 유저가 가진 major 와 다른 major 에 접근하려는 경우
    if (member.majorId !== params.majorId) {
      throw new ForbiddenException(
        '유저의 major 와 다른 major 는 접근이 불가능합니다.',
      );
    }

    // 모든 majorSkill 이 존재하는지
    // major 에 속하는 majorSkill 인지 확인하기 위해 값을 가져온다.
    const majorSkills: MajorSkillEntity[] =
      await this.prismaService.majorSkill.findMany({
        where: {
          id: {
            in: params.majorSkillIds,
          },
        },
      });

    // majorSkill 이 모두 존재하지 않는다면 에러
    if (majorSkills.length !== params.majorSkillIds.length) {
      throw new NotFoundException('존재하지 않는 majorSkill 이 존재합니다.');
    }

    // 모든 majorSkill 이 현재 major 의 하위 집합인지 확인
    const isMajorSkill: boolean = majorSkills.every((majorSkill) => {
      return majorSkill.majorId === params.majorId;
    });

    // major 에 속하지 않은 majorSkill 이라면 에러
    if (!isMajorSkill) {
      throw new BadRequestException(
        'majorSkill 중 major 에 속하지 않은 skill 이 존재합니다.',
      );
    }

    // 현재 유저랑 mapping 돼있는 majorSkill 을 mapping 하는 경우를 체크하기 위해 값을 뽑아온다.
    const exMemberMajorSkillMapping: MemberMajorMappingEntity | null =
      await this.prismaService.memberMajorSkillMapping.findFirst({
        where: {
          memberId: params.id,
          majorSkillId: {
            in: params.majorSkillIds,
          },
        },
      });

    // 이미 mapping 된 관계를 만드려는 경우 에러
    if (exMemberMajorSkillMapping) {
      throw new BadRequestException(
        '이미 존재하는 member 의 majorSkill 이 존재합니다.',
      );
    }

    // bulk insert 를 위해 전처리
    const toCreateMemberMajorSkillMapping: Pick<
      MemberMajorMappingEntity,
      'majorSkillId' | 'memberId'
    >[] = params.majorSkillIds.map((majorSkillId) => {
      return {
        majorSkillId,
        memberId: params.id,
      };
    });

    // bulk insert
    return this.prismaService.memberMajorSkillMapping.createMany({
      data: toCreateMemberMajorSkillMapping,
    });
  }

  /**
   * member 와 memberSKill 을 다중 매핑
   */
  async mappingMemberSkills(
    params: CreateMemberSkillsMappingRequestParamDto,
  ): Promise<Prisma.BatchPayload> {
    // 현재 유저랑 mapping 돼있는 memberSkill 을 mapping 하는 경우를 체크하기 위해 값을 뽑아온다.
    const exMemberSkillMapping: MemberSkillMappingEntity | null =
      await this.prismaService.memberSkillMapping.findFirst({
        where: {
          memberId: params.id,
          memberSkillId: {
            in: params.memberSkillIds,
          },
        },
      });

    // 이미 mapping 된 관계를 만드려는 경우 에러
    if (exMemberSkillMapping) {
      throw new BadRequestException(
        '이미 존재하는 member 의 majorSkill 이 존재합니다.',
      );
    }

    // bulk insert 를 위해 전처리
    const toCreateMemberSkillMappings: Pick<
      MemberSkillMappingEntity,
      'memberId' | 'memberSkillId'
    >[] = params.memberSkillIds.map((memberSkillId) => {
      return {
        memberSkillId,
        memberId: params.id,
      };
    });

    // bulk insert
    return this.prismaService.memberSkillMapping.createMany({
      data: toCreateMemberSkillMappings,
    });
  }

  /**
   * member 와 memberSKill 을 다중 매핑 제거
   */
  async unmappingMemberSkills(
    params: DeleteMemberSkillsMappingRequestParamDto,
  ): Promise<Prisma.BatchPayload> {
    // 현재 유저랑 mapping 되어있지 않은 memberSkill 을 mapping 제거 하는 경우를 체크하기 위해 값을 뽑아온다.
    const exMemberSkillMappingCount: number =
      await this.prismaService.memberSkillMapping.count({
        where: {
          memberId: params.id,
          memberSkillId: {
            in: params.memberSkillIds,
          },
        },
      });

    // mapping 되지 않은 관계를 제거하려는 경우 에러
    if (exMemberSkillMappingCount !== params.memberSkillIds.length) {
      throw new BadRequestException(
        'mapping 되지 않은 member 의 majorSkill 이 존재합니다.',
      );
    }

    // bulk delete
    return this.prismaService.memberSkillMapping.deleteMany({
      where: {
        memberId: params.id,
        memberSkillId: {
          in: params.memberSkillIds,
        },
      },
    });
  }

  /**
   * member 와 memberInterest 를 다중 매핑
   */
  async mappingMemberInterests(
    params: CreateMemberInterestMappingRequestParamDto,
  ): Promise<Prisma.BatchPayload> {
    // 현재 유저랑 mapping 돼있는 memberSkill 을 mapping 하는 경우를 체크하기 위해 값을 뽑아온다.
    const exMemberInterestMapping: MemberInterestMappingEntity | null =
      await this.prismaService.memberInterestMapping.findFirst({
        where: {
          memberId: params.id,
          memberInterestId: {
            in: params.memberInterestIds,
          },
        },
      });

    // 이미 mapping 된 관계를 만드려는 경우 에러
    if (exMemberInterestMapping) {
      throw new BadRequestException(
        '이미 존재하는 member 의 memberInterest 가 존재합니다.',
      );
    }

    // bulk insert 를 위해 전처리
    const toCreateMemberSkillMappings: Pick<
      MemberInterestMappingEntity,
      'memberId' | 'memberInterestId'
    >[] = params.memberInterestIds.map((memberInterestId) => {
      return {
        memberInterestId,
        memberId: params.id,
      };
    });

    // bulk insert
    return this.prismaService.memberInterestMapping.createMany({
      data: toCreateMemberSkillMappings,
    });
  }

  /**
   * member 와 memberInterest 를 다중 매핑 제거
   */
  async unmappingMemberInterests(
    params: DeleteMemberInterestMappingRequestParamDto,
  ): Promise<Prisma.BatchPayload> {
    // 현재 유저랑 mapping 되어있지 않은 memberSkill 을 mapping 제거 하는 경우를 체크하기 위해 값을 뽑아온다.
    const exMemberInterestMappingCount: number =
      await this.prismaService.memberInterestMapping.count({
        where: {
          memberId: params.id,
          memberInterestId: {
            in: params.memberInterestIds,
          },
        },
      });

    // mapping 되지 않은 관계를 제거하려는 경우 에러
    if (exMemberInterestMappingCount !== params.memberInterestIds.length) {
      throw new BadRequestException(
        'mapping 되지 않은 member 의 majorInterest 가 존재합니다.',
      );
    }

    // bulk delete
    return this.prismaService.memberInterestMapping.deleteMany({
      where: {
        memberId: params.id,
        memberInterestId: {
          in: params.memberInterestIds,
        },
      },
    });
  }

  /**
   * @deprecated 클라이언트에서 POST /api/members/social 걷어내면 제거
   *  유저 로그인 및 회원가입 로직
   */
  async loginByOAuth({ accessToken, oAuthAgency }: LoginByOAuthDto) {
    const socialId = await this.authService.validateOAuth(
      accessToken,
      oAuthAgency,
    );

    // 유저가 이미 등록 되어있는 회원인지 확인
    const memberStatus = await this.prismaService.member.findUnique({
      where: {
        account: socialId,
      },
      select: { id: true, status: true },
    });
    // accessToken 가져오기

    if (!!memberStatus) {
      const token = this.authService.createAccessToken(memberStatus.id);

      return {
        token,
        status: memberStatus.status,
      };
    }

    const member: Member = await this.prismaService.member.create({
      data: {
        account: socialId,
        loginType: oAuthAgency,
      },
    });
    const token = this.authService.createAccessToken(member.id);

    return {
      token,
      ...member,
    };
  }

  /**
   *  유저 정보 받는 부분 > 확장성있게 사용하려면 나중에 프로필 수정에 대한 부분의 api 기능까지도 할 수 있게 만들어야 함
   *  @deprecated 클라이언트에서 해당 패스 다 걷어내면 제거
   */
  async updateMember(
    memberId: number,
    { memberSkill, ...updateColumn }: LastStepLoginDto,
  ): Promise<MemberEntity> {
    if (memberSkill.length) {
      const memberSkills = memberSkill.map((mainSkillId) => {
        return {
          memberId,
          majorSkillId: mainSkillId,
        };
      });

      await this.prismaService.memberMajorSkillMapping.deleteMany({
        where: { memberId },
      });
      await this.prismaService.memberMajorSkillMapping.createMany({
        data: memberSkills,
      });
    }

    return this.prismaService.member.update({
      where: {
        id: memberId,
      },
      data: {
        ...updateColumn,
        status: 1,
      },
    });
  }
}
