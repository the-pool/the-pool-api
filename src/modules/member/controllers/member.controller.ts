import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Member } from '@prisma/client';
import { UserLogin } from '@src/decorators/user-login.decorator';
import { LoginByOAuthDto } from '../dtos/create-member-by-oauth.dto';
import { LastStepLoginDto } from '../dtos/last-step-login.dto';
import { MemberService } from '../services/member.service';
import { MemberLoginByOAuthResponseType } from '../types/response/member-login-by-oauth-response.type';

@ApiTags('멤버')
@Controller('api/member')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Post('/social')
  @ApiOperation({ summary: '소셜 로그인' })
  @ApiCreatedResponse({ type: MemberLoginByOAuthResponseType })
  loginByOAuth(
    @Body()
    loginByOAuthDto: LoginByOAuthDto,
  ) {
    return this.memberService.loginByOAuth(loginByOAuthDto);
  }

  @Patch()
  @ApiOperation({ summary: '입수 마지막 단계에서 받는 추가정보 api' })
  // @ApiCreatedResponse({ type })
  @UseGuards(AuthGuard('jwt'))
  lastStepLogin(
    @UserLogin('id') memberId: number,
    @Body() lastStepLoginDto: LastStepLoginDto,
  ) {
    return this.memberService.updateMember(memberId, lastStepLoginDto);
  }
}
