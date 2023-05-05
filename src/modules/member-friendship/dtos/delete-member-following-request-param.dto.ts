import { ApiProperty } from '@nestjs/swagger';
import { ModelName } from '@src/constants/enum';
import { IsRecord } from '@src/decorators/is-record.decorator';
import { MemberEntity } from '@src/modules/member/entities/member.entity';
import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class DeleteMemberFollowingRequestParamDto {
  @ApiProperty({
    description:
      'unfollow 당하는 member id (member 고유 id 와 같은 id 입니다.)',
    minimum: 1,
  })
  @IsRecord<MemberEntity>({ model: ModelName.Member, field: 'id' }, true)
  @Min(1)
  @IsInt()
  @Type(() => Number)
  memberId: number;
}
