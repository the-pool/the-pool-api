import { ApiProperty } from '@nestjs/swagger';
import { IsMemberSocialLink } from '@src/modules/member/decorators/is-member-social-link.decorator';
import { IsInt, IsString } from 'class-validator';

export class MemberSocialLinkDto {
  @ApiProperty({})
  @IsInt()
  type: number;

  @ApiProperty({})
  @IsMemberSocialLink()
  @IsString()
  url: string;
}
