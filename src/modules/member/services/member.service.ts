import { Injectable } from '@nestjs/common';
import { Member } from '@prisma/client';
import { AuthService } from '@src/modules/core/auth/services/auth.service';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { CreateMemberByOAuthDto } from '../dtos/create-member-by-oauth.dto';
import { UpdateMemberDto } from '../dtos/update-member.dto';

@Injectable()
export class MemberService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly authService: AuthService,
  ) {}
  /**
   *  유저 로그인 및 회원가입 로직
   */
  async loginByOAuth({ accessToken, oAuthAgency }: CreateMemberByOAuthDto) {
    const socialId = await this.authService.validateOAuth(
      accessToken,
      oAuthAgency,
    );

    // 유저가 이미 등록 되어있는 회원인지 확인
    const memberStatus = await this.prismaService.member.findUnique({
      where: {
        account: socialId,
      },
      select: { status: true },
    });

    // accessToken 가져오기
    const token: string = this.authService.createAccessToken(socialId);

    if (!!memberStatus) {
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

    return {
      token,
      ...member,
    };
  }

  /**
   *  유저 정보 받는 부분 > 확장성있게 사용하려면 나중에 프로필 수정에 대한 부분의 api 기능까지도 할 수 있게 만들어야 함
   */
  async updateMember(memberNo: number, updateMemberDto: UpdateMemberDto) {
    // return this.prismaService.member.update({
    //   where: {
    //     id: memberNo,
    //   },
    //   data: { ...updateMemberDto },
    //   // select: userResponse,
    // });
  }
}
