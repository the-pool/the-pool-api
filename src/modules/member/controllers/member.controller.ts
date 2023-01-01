import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  ForbiddenException,
  HttpStatus,
  InternalServerErrorException,
  Param,
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
import { SetModelNameToParam } from '@src/decorators/set-model-name-to-param.decorator';
import { UserLogin } from '@src/decorators/user-login.decorator';
import { IdRequestParamDto } from '@src/dtos/id-request-param.dto';
import { JwtAuthGuard } from '@src/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '@src/guards/optional-auth-guard';
import { AuthService } from '@src/modules/core/auth/services/auth.service';
import { MemberStatus } from '@src/modules/member/constants/member.enum';
import { UpdateMemberDto } from '@src/modules/member/dtos/update-member.dto';
import { AccessTokenType } from '@src/modules/member/types/access-token.type';
import { MemberLoginOrSignUpBadRequestResponseType } from '@src/modules/member/types/response/member-login-or-sign-up-bad-request-response.type';
import { MemberLoginOrSignUpForbiddenResponseType } from '@src/modules/member/types/response/member-login-or-sign-up-forbidden-response.type';
import { MemberLoginOrSignUpUnauthorizedResponseType } from '@src/modules/member/types/response/member-login-or-sign-up-unauthorized-response.type';
import { IdResponseType } from '@src/types/id-response-type';
import { InternalServerErrorResponseType } from '@src/types/internal-server-error-response.type';
import { NotFoundResponseType } from '@src/types/not-found-response.type';
import { LoginByOAuthDto } from '../dtos/create-member-by-oauth.dto';
import { LastStepLoginDto } from '../dtos/last-step-login.dto';
import { LoginOrSignUpDto } from '../dtos/login-or-sign-up.dto';
import { MemberEntity } from '../entities/member.entity';
import { MemberService } from '../services/member.service';
import { MemberLastStepLoginResponseType } from '../types/response/member-last-step-login-response.type';
import { MemberLoginByOAuthResponseType } from '../types/response/member-login-by-oauth-response.type';

@ApiTags('멤버 (유저)')
@ApiNotFoundResponse({ type: NotFoundResponseType })
@ApiInternalServerErrorResponse({ type: InternalServerErrorResponseType })
@Controller('api/members')
export class MemberController {
  constructor(
    private readonly memberService: MemberService,
    private readonly authService: AuthService,
  ) {}

  @ApiOperation({
    summary: 'accessToken 발급 받기 (개발용)',
  })
  @Post('access-token')
  getAccessTokenForDevelop(@Param() params: IdResponseType) {
    return this.authService.createAccessToken(params.id);
  }

  /**
   * 현재 email login 이 없어서 구현은 안하지만 추후에 추가 필요
   * 다른 api, method deprecated 처리 해야함
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
    const oldMember = await this.memberService.findOne({
      id: member.id,
      account,
      status: MemberStatus.Active,
      loginType: body.loginType,
    });

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
   * swagger 작업
   * validation service class 로 이동할거 이동
   * loginOrSignUp 도 검토
   */
  @ApiOperation({
    summary:
      '멤버 업데이트 (body 로 들어오는 값으로 업데이트 합니다. 들어오지 않는 property 대해서는 업데이트 하지 않습니다.)',
  })
  @ApiOkResponse({ type: MemberLastStepLoginResponseType })
  @ApiFailureResponse(HttpStatus.UNAUTHORIZED, 'Unauthorized')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateFromPatch(
    @UserLogin() member: MemberEntity,
    @SetModelNameToParam('member')
    @Param()
    params: IdRequestParamDto,
    @Body() body: UpdateMemberDto,
  ) {
    // 본인에 대해 업데이트 하는게 아니라면 에러
    if (params.id !== member.id) {
      throw new ForbiddenException('본인 정보가 아니면 수정이 불가능합니다.');
    }

    // 멤버가 활성중이 아니고 활성 상태로 변경하는 경우가 아니면 에러
    if (
      member.status !== MemberStatus.Active &&
      body.status !== MemberStatus.Active
    ) {
      throw new BadRequestException(
        '활성중인 유저거나 활성 상태로 변경하려는 유저만 업데이트 가능합니다.',
      );
    }

    // 변경하려는 nickname 과 같은 url 을 가진 멤버가 있는지 조회
    const duplicateNicknameMember = await this.memberService.findOne({
      NOT: {
        id: member.id,
      },
      nickname: body.nickname,
    });

    // 변경하려는 nickname 을 다른 멤버가 사용중이라면 에러
    if (duplicateNicknameMember) {
      throw new ConflictException('해당 nickname 은 사용중입니다.');
    }

    // the-pool storage 에 url 이 겹칠 일은 없지만
    // 혹시 모를 상황에 디버깅을 위해 예외처리
    // 변경하려는 thumbnail 과 같은 url 을 가진 멤버가 있는지 조회
    const duplicateThumbnailMember = await this.memberService.findOne({
      NOT: {
        id: member.id,
      },
      thumbnail: body.thumbnail,
    });

    // 변경하려는 thumbnail 을 다른 멤버가 사용중이라면 에러
    if (duplicateThumbnailMember) {
      throw new InternalServerErrorException({
        member,
        message: '멤버 patch update 중 thumbnail 겹치는 경우',
        thumbnail: body.thumbnail,
      });
    }

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
  lastStepLogin(
    @UserLogin('id') memberId: number,
    @Body() lastStepLoginDto: LastStepLoginDto,
  ) {
    return this.memberService.updateMember(memberId, lastStepLoginDto);
  }
}
