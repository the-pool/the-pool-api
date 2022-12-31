import {
  BadRequestException,
  Body,
  Controller,
  HttpStatus,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { isNil } from '@nestjs/common/utils/shared.utils';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
  IntersectionType,
} from '@nestjs/swagger';
import { ApiFailureResponse } from '@src/decorators/api-failure-response.decorator';
import { ApiSuccessResponse } from '@src/decorators/api-success-response.decorator';
import { UserLogin } from '@src/decorators/user-login.decorator';
import { JwtAuthGuard } from '@src/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '@src/guards/optional-auth-guard';
import { AuthService } from '@src/modules/core/auth/services/auth.service';
import { MemberStatus } from '@src/modules/member/constants/member.enum';
import { AccessTokenType } from '@src/modules/member/types/access-token.type';
import { MemberLoginOrSignUpBadRequestResponseType } from '@src/modules/member/types/response/member-login-or-sign-up-bad-request-response.type';
import { MemberLoginOrSignUpForbiddenResponseType } from '@src/modules/member/types/response/member-login-or-sign-up-forbidden-response.type';
import { MemberLoginOrSignUpUnauthorizedResponseType } from '@src/modules/member/types/response/member-login-or-sign-up-unauthorized-response.type';
import { InternalServerErrorResponseType } from '@src/types/internal-server-error-response.type';
import { NotFoundResponseType } from '@src/types/not-found-response.type';
import { LoginByOAuthDto } from '../dtos/create-member-by-oauth.dto';
import { LastStepLoginDto } from '../dtos/last-step-login.dto';
import { LoginOrSignUpDto } from '../dtos/login-or-sign-up.dto';
import { MemberEntity } from '../entities/member.entity';
import { MemberService } from '../services/member.service';
import { MemberLastStepLoginResponseType } from '../types/response/member-last-step-login-response.type';
import { MemberLoginByOAuthResponseType } from '../types/response/member-login-by-oauth-response.type';

@ApiTags('멤버')
@ApiNotFoundResponse({ type: NotFoundResponseType })
@ApiInternalServerErrorResponse({ type: InternalServerErrorResponseType })
@Controller('api/members')
export class MemberController {
  constructor(
    private readonly memberService: MemberService,
    private readonly authService: AuthService,
  ) {}

  /**
   * 현재 email login 이 없어서 구현은 안하지만 추후에 추가 필요
   * 다른 api, method deprecated 처리 해야함
   */
  @ApiOperation({ summary: '' })
  @UseGuards(OptionalJwtAuthGuard)
  @ApiSuccessResponse(HttpStatus.CREATED, {
    member: IntersectionType(MemberEntity, AccessTokenType),
  })
  @ApiBadRequestResponse({ type: MemberLoginOrSignUpBadRequestResponseType })
  @ApiUnauthorizedResponse({
    type: MemberLoginOrSignUpUnauthorizedResponseType,
  })
  @ApiForbiddenResponse({
    type: MemberLoginOrSignUpForbiddenResponseType,
  })
  @Post()
  async loginOrSignUp(
    @UserLogin() member: MemberEntity,
    @Body() body: LoginOrSignUpDto,
  ): Promise<{ member: MemberEntity } & AccessTokenType> {
    // access token 이 유효한지 검증한다.
    const account = await this.authService.validateExternalAccessTokenOrFail(
      body.accessToken,
      body.loginType,
    );

    // 로그인 하는 경우
    if (!isNil(member.id)) {
      // 로그인 가능한 유저인지 확인
      this.memberService.canLoginOrFail(
        account,
        body.loginType,
        member.status,
        member,
      );

      // access token 생성
      const accessToken = this.authService.createAccessToken(member.id);

      return {
        accessToken,
        member,
      };
    }

    // 회원가입 하려는 경우
    // 이미 존재하는 member 인지 확인한다.
    const oldMember = await this.memberService.findOne(
      member.id,
      account,
      MemberStatus.Active,
      body.loginType,
    );

    // 이미 존재하는 유저인 경우
    if (oldMember) {
      throw new BadRequestException('이미 존재하는 유저입니다.');
    }

    // 새로운 멤버 생성
    const newMember: MemberEntity = await this.memberService.create(
      account,
      body.loginType,
    );

    // access token 생성
    const accessToken = this.authService.createAccessToken(member.id);

    return {
      accessToken,
      member: newMember,
    };
  }

  /**
   * @deprecated 클라이언트에서 해당 패스 다 걷어내면 제거
   */
  @Post('/social')
  @ApiOperation({ summary: '소셜 로그인' })
  @ApiCreatedResponse({ type: MemberLoginByOAuthResponseType })
  @ApiFailureResponse(HttpStatus.UNAUTHORIZED, '소셜 로그인에 실패하였습니다.')
  loginByOAuth(
    @Body()
    loginByOAuthDto: LoginByOAuthDto,
  ) {
    return this.memberService.loginByOAuth(loginByOAuthDto);
  }

  @Patch()
  @ApiBearerAuth()
  @ApiOperation({ summary: '입수 마지막 단계에서 받는 추가정보 api' })
  @ApiOkResponse({ type: MemberLastStepLoginResponseType })
  @ApiFailureResponse(HttpStatus.UNAUTHORIZED, 'Unauthorized')
  @UseGuards(JwtAuthGuard)
  lastStepLogin(
    @UserLogin('id') memberId: number,
    @Body() lastStepLoginDto: LastStepLoginDto,
  ) {
    return this.memberService.updateMember(memberId, lastStepLoginDto);
  }
}
