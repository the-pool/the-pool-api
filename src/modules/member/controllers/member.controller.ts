import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
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
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
  IntersectionType,
} from '@nestjs/swagger';
import { ApiFailureResponse } from '@src/decorators/api-failure-response.decorator';
import { ApiSuccessResponse } from '@src/decorators/api-success-response.decorator';
import { SetModelNameToParam } from '@src/decorators/set-model-name-to-param.decorator';
import { setResponse } from '@src/decorators/set-response.decorator';
import { UserLogin } from '@src/decorators/user-login.decorator';
import { IdRequestParamDto } from '@src/dtos/id-request-param.dto';
import { JwtAuthGuard } from '@src/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '@src/guards/optional-auth-guard';
import { UseDevelopmentInterceptor } from '@src/interceptors/use-development.interceptor';
import { AuthService } from '@src/modules/core/auth/services/auth.service';
import { UpdateMemberDto } from '@src/modules/member/dtos/update-member.dto';
import { MemberValidationService } from '@src/modules/member/services/member-validation.service';
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

/**
 * @todo member 과제 통계 api 설명 한번 다시 듣고 구현
 * @todo swagger 개선해야함
 * @todo active member guard
 *
 * memberSkill 옮김
 * memberInterest 옮김
 */
@ApiTags('멤버 (유저)')
@ApiNotFoundResponse({ type: NotFoundResponseType })
@ApiInternalServerErrorResponse({ type: InternalServerErrorResponseType })
@Controller('api/members')
export class MemberController {
  constructor(
    private readonly memberService: MemberService,
    private readonly memberValidationService: MemberValidationService,
    private readonly authService: AuthService,
  ) {}

  @UseInterceptors(UseDevelopmentInterceptor)
  @ApiParam({
    name: 'id',
    type: 'string',
  })
  @ApiOperation({
    summary: 'accessToken 발급 받기 (개발용)',
  })
  @Post('access-token/:id')
  getAccessTokenForDevelop(@Param() params: { id: string }): string {
    return this.authService.createAccessToken(+params.id);
  }

  @ApiOperation({ summary: 'member 단일 조회' })
  @ApiSuccessResponse(HttpStatus.OK, { member: MemberEntity })
  @setResponse('member')
  @Get(':id')
  findOne(
    @SetModelNameToParam('member')
    @Param()
    params: IdRequestParamDto,
  ): Promise<MemberEntity> {
    return this.memberService.findOne({
      id: params.id,
    });
  }

  /**
   * @todo 현재 email login 이 없어서 구현은 안하지만 추후에 추가 필요
   */
  @ApiOperation({
    summary: '회원가입 & 로그인 (계정이 없다면 회원가입 처리합니다.)',
  })
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
  @UseGuards(OptionalJwtAuthGuard)
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

    // 회원가입 하려는 경우
    if (isNil(member.id)) {
      // 먼저 회원가입이 가능한지 확인한다.
      await this.memberValidationService.canCreateOrFail({
        account,
        loginType: body.loginType,
      });

      return this.memberService.signUp(account, body.loginType);
    }

    // 로그인 하는 경우
    // 먼저 로그인 가능한 유저인지 확인
    this.memberValidationService.canLoginOrFail(
      account,
      body.loginType,
      member.status,
      member,
    );

    return this.memberService.login(member);
  }

  @ApiOperation({
    summary:
      '멤버 업데이트 (body 로 들어오는 값으로 업데이트 합니다. 들어오지 않는 property 대해서는 업데이트 하지 않습니다.)',
  })
  @ApiSuccessResponse(HttpStatus.OK, {
    member: MemberLastStepLoginResponseType,
  })
  @ApiFailureResponse(HttpStatus.UNAUTHORIZED, 'Unauthorized')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @setResponse('member')
  @Patch(':id')
  async updateFromPatch(
    @UserLogin() member: MemberEntity,
    @SetModelNameToParam('member')
    @Param()
    params: IdRequestParamDto,
    @Body() body: UpdateMemberDto,
  ): Promise<MemberEntity> {
    await this.memberValidationService.canUpdateFromPatchOrFail(
      params.id,
      body,
      member,
    );

    return this.memberService.updateFromPatch(params.id, body);
  }

  /**
   * @deprecated 클라이언트에서 해당 패스 다 걷어내면 제거
   */
  @Post('/social')
  @ApiOperation({
    summary: '소셜 로그인',
    deprecated: true,
    description: '클라이언트에서 해당 api 호출 걷어내면 삭제 예정',
  })
  @ApiCreatedResponse({ type: MemberLoginByOAuthResponseType })
  @ApiFailureResponse(HttpStatus.UNAUTHORIZED, '소셜 로그인에 실패하였습니다.')
  loginByOAuth(
    @Body()
    loginByOAuthDto: LoginByOAuthDto,
  ) {
    return this.memberService.loginByOAuth(loginByOAuthDto);
  }

  /**
   * @deprecated 클라이언트에서 해당 패스 다 걷어내면 제거
   */
  @Patch()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '입수 마지막 단계에서 받는 추가정보 api',
    deprecated: true,
    description: '클라이언트에서 해당 api 호출 걷어내면 삭제 예정',
  })
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
