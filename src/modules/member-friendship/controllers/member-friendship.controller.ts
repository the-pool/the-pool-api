import { Controller, Get, Query } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { SetDefaultPageSize } from '@src/decorators/set-default-pageSize.decorator';
import { FindMemberFriendshipListQueryDto } from '@src/modules/member-friendship/dtos/find-member-friendship-list-query.dto';
import { MemberFriendshipService } from '@src/modules/member-friendship/services/member-friendship.service';
import { MemberEntity } from '@src/modules/member/entities/member.entity';
import { InternalServerErrorResponseType } from '@src/types/internal-server-error-response.type';
import { NotFoundResponseType } from '@src/types/not-found-response.type';

@ApiTags('멤버 friendships (유저)')
@ApiNotFoundResponse({ type: NotFoundResponseType })
@ApiInternalServerErrorResponse({ type: InternalServerErrorResponseType })
@Controller('api/member-friendship')
export class MemberFriendshipController {
  constructor(
    private readonly memberFriendshipService: MemberFriendshipService,
  ) {}

  @ApiOperation({
    summary: 'member 팔로워 리스트 조회 (해당 member 를 구독하는 사람)',
  })
  @ApiExtraModels(MemberEntity)
  @ApiOkResponse({
    schema: {
      properties: {
        followers: {
          type: 'array',
          items: {
            $ref: getSchemaPath(MemberEntity),
          },
        },
        totalCount: {
          type: 'number',
        },
      },
    },
  })
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

  @ApiOperation({
    summary: 'member 팔로잉 리스트 조회 (해당 member 를 구독하는 사람)',
  })
  @ApiExtraModels(MemberEntity)
  @ApiOkResponse({
    schema: {
      properties: {
        followings: {
          type: 'array',
          items: {
            $ref: getSchemaPath(MemberEntity),
          },
        },
        totalCount: {
          type: 'number',
        },
      },
    },
  })
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
}
