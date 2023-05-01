import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AllowMemberStatusesSetMetadataGuard } from '@src/decorators/member-statuses-set-metadata.guard-decorator';
import { OtherMemberSetMetadataGuard } from '@src/decorators/other-member-set-metadata.guard-decorator';
import { SetDefaultPageSize } from '@src/decorators/set-default-pageSize.decorator';
import { SetResponseSetMetadataInterceptor } from '@src/decorators/set-response-set-metadata.interceptor-decorator';
import { UserLogin } from '@src/decorators/user-login.decorator';
import { JwtAuthGuard } from '@src/guards/jwt-auth.guard';
import {
  ApiCreateFollowing,
  ApiDeleteFollowing,
  ApiFindAllFollowers,
  ApiFindAllFollowings,
} from '@src/modules/member-friendship/controllers/member-friendship.swagger';
import { CreateMemberFollowingRequestParamDto } from '@src/modules/member-friendship/dtos/create-member-following-request-param.dto';
import { DeleteMemberFollowingRequestParamDto } from '@src/modules/member-friendship/dtos/delete-member-following-request-param.dto';
import { FindMemberFriendshipListQueryDto } from '@src/modules/member-friendship/dtos/find-member-friendship-list-query.dto';
import { MemberFollowEntity } from '@src/modules/member-friendship/entities/member-follow.entity';
import { MemberFriendshipService } from '@src/modules/member-friendship/services/member-friendship.service';
import { MemberStatus } from '@src/modules/member/constants/member.enum';
import { MemberEntity } from '@src/modules/member/entities/member.entity';
import { InternalServerErrorResponseType } from '@src/types/internal-server-error-response.type';
import { NotFoundResponseType } from '@src/types/not-found-response.type';

@ApiTags('멤버 friendships (유저 follow)')
@ApiNotFoundResponse({ type: NotFoundResponseType })
@ApiInternalServerErrorResponse({ type: InternalServerErrorResponseType })
@Controller('api/member-friendship')
export class MemberFriendshipController {
  constructor(
    private readonly memberFriendshipService: MemberFriendshipService,
  ) {}

  @ApiFindAllFollowers(
    'member 팔로워 리스트 조회 (해당 member 를 구독하는 사람)',
  )
  @Get('followers')
  async findAllFollowers(
    @Query()
    @SetDefaultPageSize(20)
    query: FindMemberFriendshipListQueryDto,
  ): Promise<{
    followers: MemberEntity[];
    totalCount: number;
  }> {
    const { followers, totalCount } =
      await this.memberFriendshipService.findAll(query, 'follower');

    return {
      followers,
      totalCount,
    };
  }

  @ApiFindAllFollowings(
    'member 팔로잉 리스트 조회 (해당 member 가 구독하는 사람)',
  )
  @Get('followings')
  async findAllFollowings(
    @Query()
    @SetDefaultPageSize(20)
    query: FindMemberFriendshipListQueryDto,
  ): Promise<{
    followings: MemberEntity[];
    totalCount: number;
  }> {
    const { followings, totalCount } =
      await this.memberFriendshipService.findAll(query, 'following');

    return {
      followings,
      totalCount,
    };
  }

  @ApiCreateFollowing('member follow (해당 member 를 팔로우 합니다.)')
  @AllowMemberStatusesSetMetadataGuard([MemberStatus.Active])
  @OtherMemberSetMetadataGuard('memberId')
  @UseGuards(JwtAuthGuard)
  @SetResponseSetMetadataInterceptor('memberFollow')
  @Post('followings/:memberId')
  createFollowing(
    @UserLogin() member: MemberEntity,
    @Param() param: CreateMemberFollowingRequestParamDto,
  ): Promise<MemberFollowEntity> {
    return this.memberFriendshipService.createFollowing(
      param.memberId,
      member.id,
    );
  }

  @ApiDeleteFollowing('member follow (해당 member 를 팔로우 합니다.)')
  @AllowMemberStatusesSetMetadataGuard([MemberStatus.Active])
  @OtherMemberSetMetadataGuard('memberId')
  @UseGuards(JwtAuthGuard)
  @SetResponseSetMetadataInterceptor('memberFollow')
  @Delete('followings/:memberId')
  deleteFollowing(
    @UserLogin() member: MemberEntity,
    @Param() param: DeleteMemberFollowingRequestParamDto,
  ): Promise<MemberFollowEntity> {
    return this.memberFriendshipService.deleteFollowing(
      param.memberId,
      member.id,
    );
  }
}
