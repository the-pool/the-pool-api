import { Injectable } from '@nestjs/common';
import { Member, Prisma } from '@prisma/client';
import { AuthService } from '@src/modules/core/auth/services/auth.service';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { MemberLoginType } from '@src/modules/member/constants/member.enum';
import { PatchUpdateMemberRequestBodyDto } from '@src/modules/member/dtos/patch-update-member-request-body.dto';
import { AccessToken } from '@src/modules/member/types/member.type';
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
   * member 단일 조회
   */
  findOne(where: Prisma.MemberWhereInput): Promise<MemberEntity> {
    return this.prismaService.member.findFirst({
      where,
    }) as Promise<MemberEntity>;
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
