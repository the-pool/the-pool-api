import { ApiProperty } from '@nestjs/swagger';
import { MemberFollow } from '@prisma/client';

export class MemberFollowEntity implements MemberFollow {
  @ApiProperty({
    description: 'memberFollow 고유 Id',
  })
  id: number;

  @ApiProperty({
    description: 'follower 고유 Id (member 고유 Id 와 같음)',
  })
  followerId: number;

  @ApiProperty({
    description: 'following 고유 Id (member 고유 Id 와 같음)',
  })
  followingId: number;

  @ApiProperty({
    example: '2022-10-03T09:54:50.563Z',
    description: '생성일자',
  })
  createdAt: Date;
}
