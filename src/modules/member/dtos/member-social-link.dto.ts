import { ApiProperty } from '@nestjs/swagger';
import { IsMemberSocialLink } from '@src/modules/member/decorators/is-member-social-link.decorator';
import { IsInt, IsString, Min } from 'class-validator';

export class MemberSocialLinkDto {
  @ApiProperty({
    description:
      'memberSocialLink type memberSocialLinks 의 id 와 같은 값입니다.',
    minimum: 1,
  })
  @Min(1)
  @IsInt()
  type: number;

  @ApiProperty({
    description:
      'memberSocialLink url<br />' +
      'https:// 필수입니다.<br />' +
      'https://www.~~ 허용합니다.',
    example: 'https://github.com/the-pool/the-pool-api',
  })
  @IsMemberSocialLink()
  @IsString()
  url: string;
}
