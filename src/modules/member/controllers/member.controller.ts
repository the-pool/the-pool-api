import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginByOAuthDto } from '../dtos/create-member-by-oauth.dto';
import { UpdateMemberDto } from '../dtos/update-member.dto';
import { MemberService } from '../services/member.service';
import { MemberLoginByOAuthResponseType } from '../types/response/member-login-by-oauth-response.type';

@ApiTags('멤버')
@Controller('api/member')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Post('/social')
  @ApiOperation({ summary: '소셜 로그인' })
  @ApiCreatedResponse({ type: MemberLoginByOAuthResponseType })
  async loginByOAuth(
    @Body()
    loginByOAuthDto: LoginByOAuthDto,
  ) {
    return await this.memberService.loginByOAuth(loginByOAuthDto);
  }

  @Put(':memberNo')
  @ApiOperation({ summary: '멤버 정보 수정' })
  // @ApiCreatedResponse({ type })
  async updateMember(
    @Param('memberNo', ParseIntPipe) memberNo: number,
    @Body() updateMemberDto: UpdateMemberDto,
  ) {
    return await this.memberService.updateMember(memberNo, updateMemberDto);
  }
}
