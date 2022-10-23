import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from '@src/modules/core/auth/services/auth.service';
import { CreateMemberByOAuthDto } from '../dtos/create-member-by-oauth.dto';
import { UpdateMemberDto } from '../dtos/update-member.dto';
import { MemberService } from '../services/member.service';

@ApiTags('멤버')
@Controller('api/member')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Post('/social')
  @ApiOperation({ summary: '멤버 생성' })
  @ApiCreatedResponse()
  async logInByOAuth(
    @Body()
    createMemberByOAuthDto: CreateMemberByOAuthDto,
  ) {
    return await this.memberService.loginByOAuth(createMemberByOAuthDto);
  }

  @Put(':memberNo')
  @ApiOperation({ summary: '멤버 정보 수정' })
  @ApiCreatedResponse()
  async updateMember(
    @Param('memberNo', ParseIntPipe) memberNo: number,
    @Body() updateMemberDto: UpdateMemberDto,
  ) {
    return await this.memberService.updateMember(memberNo, updateMemberDto);
  }
}
