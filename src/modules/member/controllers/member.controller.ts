import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { isNil } from '@nestjs/common/utils/shared.utils';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
  getSchemaPath,
  IntersectionType,
} from '@nestjs/swagger';
import { ApiFailureResponse } from '@src/decorators/api-failure-response.decorator';
import { ApiSuccessResponse } from '@src/decorators/api-success-response.decorator';
import { SetDefaultPageSize } from '@src/decorators/set-default-pageSize.decorator';
import { SetModelNameToParam } from '@src/decorators/set-model-name-to-param.decorator';
import { UserLogin } from '@src/decorators/user-login.decorator';
import { IdRequestParamDto } from '@src/dtos/id-request-param.dto';
import { JwtAuthGuard } from '@src/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '@src/guards/optional-auth-guard';
import { UseDevelopmentInterceptor } from '@src/interceptors/use-development.interceptor';
import { AuthService } from '@src/modules/core/auth/services/auth.service';
import { FindAllFollowListRequestQueryDto } from '@src/modules/member/dtos/find-all-follow-list-request-query.dto';
import { UpdateMemberDto } from '@src/modules/member/dtos/update-member.dto';
import { MemberInterestEntity } from '@src/modules/member/entities/member-interest.entity';
import { MemberReportEntity } from '@src/modules/member/entities/member-report.entity';
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
import { MemberSkillEntity } from '../entities/member-skill.entity';
import { MemberEntity } from '../entities/member.entity';
import { MemberService } from '../services/member.service';
import { MemberLastStepLoginResponseType } from '../types/response/member-last-step-login-response.type';
import { MemberLoginByOAuthResponseType } from '../types/response/member-login-by-oauth-response.type';

/**
 * @todo member 과제 통계 api 설명 한번 다시 듣고 구현
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
  @Get(':id')
  findOne(
    @SetModelNameToParam('member')
    @Param()
    params: IdRequestParamDto,
  ): Promise<{ member: MemberEntity }> {
    return this.memberService.findOne({
      id: params.id,
    });
  }

  @ApiOperation({ summary: 'member 의 스킬 리스트 조회' })
  @ApiExtraModels(MemberSkillEntity)
  @ApiOkResponse({
    schema: {
      properties: {
        memberSkills: {
          type: 'array',
          items: {
            $ref: getSchemaPath(MemberSkillEntity),
          },
        },
      },
    },
  })
  @Get(':id/skills')
  findAllSkills(
    @SetModelNameToParam('member')
    @Param()
    params: IdRequestParamDto,
  ): Promise<{ memberSkills: MemberSkillEntity[] }> {
    return this.memberService.findAllSkills({
      memberSkillMappings: {
        some: {
          memberId: params.id,
        },
      },
    });
  }

  @ApiOperation({ summary: 'member 관심사 리스트 조회' })
  @ApiExtraModels(MemberInterestEntity)
  @ApiOkResponse({
    schema: {
      properties: {
        memberInterests: {
          type: 'array',
          items: {
            $ref: getSchemaPath(MemberInterestEntity),
          },
        },
      },
    },
  })
  @Get(':id/interests')
  findAlliInterests(
    @SetModelNameToParam('member')
    @Param()
    params: IdRequestParamDto,
  ): Promise<{ memberInterests: MemberInterestEntity[] }> {
    return this.memberService.findAlliInterests({
      memberInterestMappings: {
        some: {
          memberId: params.id,
        },
      },
    });
  }

  @ApiOperation({ summary: 'member report 조회' })
  @ApiSuccessResponse(HttpStatus.OK, { memberReport: MemberReportEntity })
  @Get(':id/report')
  findOneReport(
    @SetModelNameToParam('member')
    @Param()
    params: IdRequestParamDto,
  ): Promise<{ memberReport: MemberReportEntity }> {
    return this.memberService.findOneReport({
      memberId: params.id,
    });
  }

  @ApiOperation({
    summary: 'member 팔로워 리스트 조회 (해당 member 를 구독하는 사람)',
  })
  @ApiExtraModels(MemberEntity)
  @ApiOkResponse({
    schema: {
      properties: {
        followers: {
          type: 'array',
          items: {
            $ref: getSchemaPath(MemberEntity),
          },
        },
        totalCount: {
          type: 'number',
        },
      },
    },
  })
  @Get(':id/followers')
  findAllFollowers(
    @Query()
    @SetDefaultPageSize(20)
    query: FindAllFollowListRequestQueryDto,
    @SetModelNameToParam('member')
    @Param()
    params: IdRequestParamDto,
  ): Promise<{ followers: MemberEntity[] }> {
    return this.memberService.findAllFollowers(params.id, query);
  }

  @ApiOperation({
    summary: 'member 팔로잉 리스트 조회 (해당 member 가 구독하는 사람)',
  })
  @ApiExtraModels(MemberEntity)
  @ApiOkResponse({
    schema: {
      properties: {
        followings: {
          type: 'array',
          items: {
            $ref: getSchemaPath(MemberEntity),
          },
        },
        totalCount: {
          type: 'number',
        },
      },
    },
  })
  @Get(':id/followings')
  findAllFollowings(
    @Query()
    @SetDefaultPageSize(20)
    query: FindAllFollowListRequestQueryDto,
    @SetModelNameToParam('member')
    @Param()
    params: IdRequestParamDto,
  ): Promise<{ followings: MemberEntity[] }> {
    return this.memberService.findAllFollowings(params.id, query);
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
  @Patch(':id')
  async updateFromPatch(
    @UserLogin() member: MemberEntity,
    @SetModelNameToParam('member')
    @Param()
    params: IdRequestParamDto,
    @Body() body: UpdateMemberDto,
  ): Promise<{ member: MemberEntity }> {
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
