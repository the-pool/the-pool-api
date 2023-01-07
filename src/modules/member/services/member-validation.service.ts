import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { isNil } from '@nestjs/common/utils/shared.utils';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import {
  MemberLoginType,
  MemberStatus,
} from '@src/modules/member/constants/member.enum';
import { UpdateMemberDto } from '@src/modules/member/dtos/update-member.dto';
import { MemberEntity } from '@src/modules/member/entities/member.entity';

@Injectable()
export class MemberValidationService {
  constructor(private readonly prismaService: PrismaService) {}

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
   * member 를 생성할 수 있는지 판별한다.
   */
  async canCreateOrFail(
    newMember: Prisma.MemberWhereUniqueInput,
  ): Promise<void> {
    // 이미 존재하는 member 인지 확인한다.
    const oldMember = await this.prismaService.member.findUnique({
      where: {
        ...newMember,
      },
    });

    if (!oldMember) {
      return;
    }

    // 대기중인 member 인 경우
    if (oldMember.status === MemberStatus.Pending) {
      throw new BadRequestException('pending 상태인 member 입니다.');
    }

    // 활성중인 member 인 경우
    if (oldMember.status === MemberStatus.Active) {
      throw new BadRequestException('이미 활성중인 member 입니다.');
    }
  }

  /**
   * member 를 update 할 수 있는지 판별한다.
   */
  async canUpdateFromPatchOrFail(
    updateId: number,
    updateInfo: UpdateMemberDto,
    oldMember: MemberEntity,
  ): Promise<void> {
    // 본인에 대해 업데이트 하는게 아니라면 에러
    if (updateId !== oldMember.id) {
      throw new ForbiddenException('본인 정보가 아니면 수정이 불가능합니다.');
    }

    // 멤버가 활성중이 아니고 활성 상태로 변경하는 경우가 아니면 에러
    if (
      oldMember.status !== MemberStatus.Active &&
      (updateInfo.status !== MemberStatus.Active || isNil(updateInfo.status))
    ) {
      throw new BadRequestException(
        '활성중인 유저거나 활성 상태로 변경하려는 유저만 업데이트 가능합니다.',
      );
    }

    // nickname 을 업데이트 한다면 유효성 체크를 진행
    if (!isNil(updateInfo.nickname)) {
      // 변경하려는 nickname 과 같은 url 을 가진 멤버가 있는지 조회
      const duplicateNicknameMember =
        await this.prismaService.member.findUnique({
          where: {
            NOT: {
              id: oldMember.id,
            },
            nickname: updateInfo.nickname,
          },
        });

      // 변경하려는 nickname 을 다른 멤버가 사용중이라면 에러
      if (duplicateNicknameMember) {
        throw new ConflictException('해당 nickname 은 사용중입니다.');
      }
    }

    // thumbnail 을 업데이트 한다면 유효성 체크를 진행
    if (!isNil(updateInfo.thumbnail)) {
      // the-pool storage 에 url 이 겹칠 일은 없지만
      // 혹시 모를 상황에 디버깅을 위해 예외처리
      // 변경하려는 thumbnail 과 같은 url 을 가진 멤버가 있는지 조회
      const duplicateThumbnailMember =
        await this.prismaService.member.findUnique({
          where: {
            NOT: {
              id: oldMember.id,
            },
            thumbnail: updateInfo.thumbnail,
          },
        });

      // 변경하려는 thumbnail 을 다른 멤버가 사용중이라면 에러
      if (duplicateThumbnailMember) {
        throw new InternalServerErrorException({
          member: oldMember,
          message: '멤버 patch update 중 thumbnail 겹치는 경우',
          thumbnail: updateInfo.thumbnail,
        });
      }
    }
  }
}
