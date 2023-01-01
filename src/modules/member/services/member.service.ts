import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Member, Prisma } from '@prisma/client';
import { AuthService } from '@src/modules/core/auth/services/auth.service';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import {
  MemberLoginType,
  MemberStatus,
} from '@src/modules/member/constants/member.enum';
import { UpdateMemberDto } from '@src/modules/member/dtos/update-member.dto';
import { LoginByOAuthDto } from '../dtos/create-member-by-oauth.dto';
import { LastStepLoginDto } from '../dtos/last-step-login.dto';
import { MemberEntity } from '../entities/member.entity';

@Injectable()
export class MemberService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly authService: AuthService,
  ) {}

  /**
   * member 가 로그인 할 수 있는 사용자인지 판별
   */
  canLoginOrFail(
    account: string,
    loginType: MemberLoginType,
    memberStatus: MemberStatus,
    member: MemberEntity,
  ): void {
    // request 로 들어온 유저가 없는 경우
    if (
      account !== member.account ||
      loginType !== member.loginType ||
      memberStatus !== member.status
    ) {
      throw new NotFoundException('존재하지 않는 리소스입니다.');
    }

    // pending 상태의 유저인 경우
    if (memberStatus === MemberStatus.Pending) {
      throw new ForbiddenException('추가정보 입력이 필요한 유저입니다.');
    }

    // 비활성 유저인 경우
    if (memberStatus === MemberStatus.Inactive) {
      throw new ForbiddenException('비활성된 유저입니다.');
    }
  }

  /**
   * member 단일 조회
   */
  findOne(member: Prisma.MemberWhereUniqueInput): Promise<MemberEntity | null> {
    return this.prismaService.member.findUnique({
      where: {
        ...member,
      },
    });
  }

  /**
   * member 생성
   * memberReport 까지 생성해준다.
   */
  create(account: string, loginType: MemberLoginType): Promise<MemberEntity> {
    return this.prismaService.member.create({
      data: {
        account,
        loginType,
        memberReport: {
          create: {},
        },
      },
    });
  }

  updateFromPatch(id: number, data: UpdateMemberDto) {
    return this.prismaService.member.update({
      data,
      where: {
        id,
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
          mainSkillId,
        };
      });

      await this.prismaService.memberSkill.deleteMany({
        where: { memberId },
      });
      await this.prismaService.memberSkill.createMany({
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
