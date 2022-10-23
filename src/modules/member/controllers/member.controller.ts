import { Body, Controller, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from '@src/modules/core/auth/services/auth.service';
import { CreateMemberByOAuthDto } from '../dtos/create-member-by-oauth.dto';
import { MemberService } from '../services/member.service';

@ApiTags('멤버')
@Controller('api/member')
export class MemberController {
  constructor(
    private readonly authService: AuthService,
    private readonly memberService: MemberService,
  ) {}

  @Post()
  @ApiOperation({ summary: '멤버 생성' })
  @ApiCreatedResponse()
  async createByOAuth(
    @Body()
    createMemberByOAuthDto: CreateMemberByOAuthDto,
  ) {
    // 넘어온 access token 검증
    await this.authService.validateOAuth(createMemberByOAuthDto);

    // 유저 로그인 및 회원가입 로직
    await this.memberService.createByOAuth();
  }
}
