import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Member, Prisma } from '@prisma/client';
import { AuthService } from '@src/modules/core/auth/services/auth.service';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { MajorSkillEntity } from '@src/modules/major/entities/major-skill.entity';
import { MemberLoginType } from '@src/modules/member/constants/member.enum';
import { PatchUpdateMemberRequestBodyDto } from '@src/modules/member/dtos/patch-update-member-request-body.dto';
import { AccessToken } from '@src/modules/member/types/member.type';
import { LoginByOAuthDto } from '../dtos/create-member-by-oauth.dto';
import { CreateMemberMajorSkillMappingRequestParamDto } from '../dtos/create-member-major-skill-mapping-request-param.dto';
import { LastStepLoginDto } from '../dtos/last-step-login.dto';
import { MemberMajorMappingEntity } from '../entities/member-major-mapping.entity';
import { MemberEntity } from '../entities/member.entity';

@Injectable()
export class MemberService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly authService: AuthService,
  ) {}

  /**
   * member 단일 조회
   */
  findOne(where: Prisma.MemberWhereInput): Promise<MemberEntity | null> {
    return this.prismaService.member.findFirst({
      where,
    });
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
  updateFromPatch(
    id: number,
    data: PatchUpdateMemberRequestBodyDto,
  ): Promise<MemberEntity> {
    return this.prismaService.member.update({
      data,
      where: {
        id,
      },
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

    // 모든 majorSkill 이 존재하는지 major 에 속하는 majorSkill 인지 확인하기 위해 값을 가져온다.
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
