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
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ApiFailureResponse } from '@src/decorators/api-failure-response.decorator';
import { AllowMemberStatuses } from '@src/decorators/member-status.decorator';
import { OwnMemberDecorator } from '@src/decorators/own-member.decorator';
import { SetModelNameToParam } from '@src/decorators/set-model-name-to-param.decorator';
import { SetResponse } from '@src/decorators/set-response.decorator';
import { UserLogin } from '@src/decorators/user-login.decorator';
import { IdRequestParamDto } from '@src/dtos/id-request-param.dto';
import { JwtAuthGuard } from '@src/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '@src/guards/optional-auth-guard';
import { UseDevelopmentInterceptor } from '@src/interceptors/use-development.interceptor';
import { AuthService } from '@src/modules/core/auth/services/auth.service';
import { MemberStatus } from '@src/modules/member/constants/member.enum';
import {
  ApiFindOne,
  ApiGetAccessTokenForDevelop,
  ApiLoginOrSignUp,
  ApiUpdateFromPatch,
} from '@src/modules/member/controllers/member.swagger';
import { CreateMemberMajorMappingRequestParamDto } from '@src/modules/member/dtos/create-member-major-mapping-request-param.dto';
import { PatchUpdateMemberRequestBodyDto } from '@src/modules/member/dtos/patch-update-member-request-body.dto';
import { MemberValidationService } from '@src/modules/member/services/member-validation.service';
import { AccessToken } from '@src/modules/member/types/member.type';
import { InternalServerErrorResponseType } from '@src/types/internal-server-error-response.type';
import { NotFoundResponseType } from '@src/types/not-found-response.type';
import { LoginByOAuthDto } from '../dtos/create-member-by-oauth.dto';
import { LastStepLoginDto } from '../dtos/last-step-login.dto';
import { LoginOrSignUpRequestBodyDto } from '../dtos/login-or-sign-up-request-body.dto';
import { MemberEntity } from '../entities/member.entity';
import { MemberService } from '../services/member.service';
import { MemberLastStepLoginResponseType } from '../types/response/member-last-step-login-response.type';
import { MemberLoginByOAuthResponseType } from '../types/response/member-login-by-oauth-response.type';

/**
 * @todo member 과제 통계 api 설명 한번 다시 듣고 구현
 * @todo active member guard
 *
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

  @ApiGetAccessTokenForDevelop('accessToken 발급 받기 (개발용)')
  @UseInterceptors(UseDevelopmentInterceptor)
  @Post('access-token/:id')
  getAccessTokenForDevelop(@Param() params: { id: string }): string {
    return this.authService.createAccessToken(+params.id);
  }

  @ApiFindOne('member 단일 조회')
  @SetResponse('member')
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
  @ApiLoginOrSignUp('회원가입 | 로그인 (계정이 없다면 회원가입 처리합니다.)')
  @UseGuards(OptionalJwtAuthGuard)
  @Post()
  async loginOrSignUp(
    @UserLogin() member: MemberEntity,
    @Body() body: LoginOrSignUpRequestBodyDto,
  ): Promise<{ member: MemberEntity } & AccessToken> {
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

  @ApiUpdateFromPatch(
    '멤버 업데이트 (body 로 들어오는 값으로 업데이트 합니다. 들어오지 않는 property 대해서는 업데이트 하지 않습니다.)',
  )
  @UseGuards(JwtAuthGuard)
  @SetResponse('member')
  @Patch(':id')
  async updateFromPatch(
    @UserLogin() member: MemberEntity,
    @SetModelNameToParam('member')
    @Param()
    params: IdRequestParamDto,
    @Body() body: PatchUpdateMemberRequestBodyDto,
  ): Promise<MemberEntity> {
    await this.memberValidationService.canUpdateFromPatchOrFail(
      params.id,
      body,
      member,
    );

    return this.memberService.updateFromPatch(params.id, body);
  }

  @AllowMemberStatuses([MemberStatus.Pending])
  @OwnMemberDecorator()
  @UseGuards(JwtAuthGuard)
  @Post(':id/majors/:majorId')
  mappingMajor(
    @UserLogin() member: MemberEntity,
    @SetModelNameToParam('member')
    @Param()
    params: CreateMemberMajorMappingRequestParamDto,
  ) {
    return this.memberService.mappingMajor(params.id, params.majorId);
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
