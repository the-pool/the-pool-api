import { Body, Controller, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ErrorResponseType } from '@src/common/common';
import { UserLogin } from '@src/decorators/user-login.decorator';
import { LoginByOAuthDto } from '../dtos/create-member-by-oauth.dto';
import { LastStepLoginDto } from '../dtos/last-step-login.dto';
import { MemberService } from '../services/member.service';
import { MemberLastStepLoginResponseType } from '../types/response/member-last-step-login-response.type';
import { MemberLoginByOAuthResponseType } from '../types/response/member-login-by-oauth-response.type';

@ApiTags('멤버')
@Controller('api/member')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Post('/social')
  @ApiOperation({ summary: '소셜 로그인' })
  @ApiCreatedResponse({ type: MemberLoginByOAuthResponseType })
  @ApiUnauthorizedResponse(
    ErrorResponseType('invalid accessToken', 401, [
      { message: '소셜 로그인에 실패하였습니다.' },
    ]),
  )
  loginByOAuth(
    @Body()
    loginByOAuthDto: LoginByOAuthDto,
  ) {
    return this.memberService.loginByOAuth(loginByOAuthDto);
  }

  @Patch()
  @ApiOperation({ summary: '입수 마지막 단계에서 받는 추가정보 api' })
  @ApiOkResponse({ type: MemberLastStepLoginResponseType })
  @UseGuards(AuthGuard('jwt'))
  lastStepLogin(
    @UserLogin('id') memberId: number,
    @Body() lastStepLoginDto: LastStepLoginDto,
  ) {
    return this.memberService.updateMember(memberId, lastStepLoginDto);
  }
}
