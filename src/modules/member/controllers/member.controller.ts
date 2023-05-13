import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { ModelName } from '@src/constants/enum';
import { MemberMajorSetMetadataGuard } from '@src/decorators/member-major-set-metadata.guard-decorator';
import { AllowMemberStatusesSetMetadataGuard } from '@src/decorators/member-statuses-set-metadata.guard-decorator';
import { OwnMemberSetMetadataGuard } from '@src/decorators/own-member-set-metadata.guard-decorator';
import { SetModelNameToParam } from '@src/decorators/set-model-name-to-param.decorator';
import { SetResponseSetMetadataInterceptor } from '@src/decorators/set-response-set-metadata.interceptor-decorator';
import { UserLogin } from '@src/decorators/user-login.decorator';
import { IdRequestParamDto } from '@src/dtos/id-request-param.dto';
import { JwtAuthGuard } from '@src/guards/jwt-auth.guard';
import { AuthService } from '@src/modules/core/auth/services/auth.service';
import { MemberStatus } from '@src/modules/member/constants/member.enum';
import {
  ApiFindLessonSolutionStatistics,
  ApiFindOne,
  ApiGetAccessTokenForDevelop,
  ApiLoginOrSignUp,
  ApiMappingMajor,
  ApiMappingMajorSkill,
  ApiMappingMemberInterests,
  ApiMappingMemberSkills,
  ApiUnmappingMemberInterests,
  ApiUnmappingMemberSkills,
  ApiUpdateFromPatch,
} from '@src/modules/member/controllers/member.swagger';
import { CreateMemberInterestMappingRequestParamDto } from '@src/modules/member/dtos/create-member-interest-mapping.request-param.dto';
import { CreateMemberMajorMappingRequestParamDto } from '@src/modules/member/dtos/create-member-major-mapping-request-param.dto';
import { CreateMemberMajorSkillMappingRequestParamDto } from '@src/modules/member/dtos/create-member-major-skill-mapping-request-param.dto';
import { CreateMemberSkillsMappingRequestParamDto } from '@src/modules/member/dtos/create-member-skills-mapping-request-param.dto';
import { DeleteMemberInterestMappingRequestParamDto } from '@src/modules/member/dtos/delete-member-interest-mapping.request-param.dto';
import { DeleteMemberSkillsMappingRequestParamDto } from '@src/modules/member/dtos/delete-member-skills-mapping-request-param.dto';
import { LoginOrSignUpRequestBodyDto } from '@src/modules/member/dtos/login-or-sign-up-request-body.dto';
import { PatchUpdateMemberRequestBodyDto } from '@src/modules/member/dtos/patch-update-member-request-body.dto';
import { MemberSocialLinkMappingEntity } from '@src/modules/member/entities/member-social-link-mapping.entity';
import { MemberEntity } from '@src/modules/member/entities/member.entity';
import { MemberValidationService } from '@src/modules/member/services/member-validation.service';
import { MemberService } from '@src/modules/member/services/member.service';
import { AccessToken } from '@src/modules/member/types/member.type';
import { LessonSolutionStatisticsResponseBodyDto } from '@src/modules/solution/dtos/lesson-solution-statistics-response-body.dto';
import { ParsePositiveIntPipe } from '@src/pipes/parse-positive-int.pipe';
import { InternalServerErrorResponseType } from '@src/types/internal-server-error-response.type';
import { NotFoundResponseType } from '@src/types/not-found-response.type';

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

  @ApiGetAccessTokenForDevelop('accessToken 발급 받기 (개발용)')
  @Post('access-token/:id')
  getAccessTokenForDevelop(@Param() params: { id: string }): string {
    return this.authService.createAccessToken(+params.id);
  }

  @ApiFindOne('member 단일 조회')
  @SetResponseSetMetadataInterceptor('member')
  @Get(':id')
  findOne(
    @Param('id', ParsePositiveIntPipe) id: number,
  ): Promise<
    MemberEntity & { memberSocialLinkMappings: MemberSocialLinkMappingEntity[] }
  > {
    return this.memberService.findOneOrFail({
      id,
    });
  }

  @ApiFindLessonSolutionStatistics('member 의 과제 통계')
  @Get(':id/lesson-solution-statistics')
  async findLessonSolutionStatistics(
    @SetModelNameToParam(ModelName.Member)
    @Param()
    params: IdRequestParamDto,
  ): Promise<LessonSolutionStatisticsResponseBodyDto> {
    const lessonSolutionStatisticsResponseBodyDto =
      await this.memberService.findLessonSolutionStatisticsById(params.id);

    return new LessonSolutionStatisticsResponseBodyDto(
      lessonSolutionStatisticsResponseBodyDto,
    );
  }

  /**
   * @todo 현재 email login 이 없어서 구현은 안하지만 추후에 추가 필요
   */
  @ApiLoginOrSignUp(
    '회원가입 or 로그인 (body 로 넘어온 oAuthToken 에 해당하는 계정이 없다면 회원가입 처리합니다.)',
  )
  @Post()
  async loginOrSignUp(
    @Body() body: LoginOrSignUpRequestBodyDto,
  ): Promise<{ member: MemberEntity } & AccessToken> {
    // access token 이 유효한지 검증한다.
    const account = await this.authService.validateExternalAccessTokenOrFail(
      body.oAuthToken,
      body.loginType,
    );

    // account 를 통해 member 가 있는지 조회한다.
    const member = await this.memberService.findOne({
      account,
    });

    // 회원가입 하려는 경우
    if (member === null) {
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
  @SetResponseSetMetadataInterceptor('member')
  @Patch(':id')
  async updateFromPatch(
    @UserLogin() oldMember: MemberEntity,
    @SetModelNameToParam(ModelName.Member)
    @Param()
    params: IdRequestParamDto,
    @Body() body: PatchUpdateMemberRequestBodyDto,
  ): Promise<
    MemberEntity & { memberSocialLinkMappings: MemberSocialLinkMappingEntity[] }
  > {
    const { memberSocialLinks, ...newMember } = body;

    await this.memberValidationService.canUpdateFromPatchOrFail(
      params.id,
      newMember,
      oldMember,
    );

    return this.memberService.updateFromPatch(
      params.id,
      newMember,
      memberSocialLinks,
    );
  }

  @ApiMappingMajor('해당 member 와 major 를 연결해줍니다.')
  @MemberMajorSetMetadataGuard()
  @AllowMemberStatusesSetMetadataGuard([
    MemberStatus.Pending,
    MemberStatus.Active,
  ])
  @OwnMemberSetMetadataGuard()
  @UseGuards(JwtAuthGuard)
  @SetResponseSetMetadataInterceptor('member')
  @Post(':id/majors/:majorId')
  mappingMajor(
    @SetModelNameToParam(ModelName.Member)
    @Param()
    params: CreateMemberMajorMappingRequestParamDto,
  ) {
    return this.memberService.mappingMajor(params.id, params.majorId);
  }

  @ApiMappingMajorSkill('해당 member 와 majorSkill 을 연결해줍니다.')
  @AllowMemberStatusesSetMetadataGuard([
    MemberStatus.Pending,
    MemberStatus.Active,
  ])
  @OwnMemberSetMetadataGuard()
  @UseGuards(JwtAuthGuard)
  @Post(':id/majors/:majorId/major-skills/:majorSkillIds')
  mappingMajorSkill(
    @UserLogin() member: MemberEntity,
    @SetModelNameToParam(ModelName.Member)
    @Param()
    params: CreateMemberMajorSkillMappingRequestParamDto,
  ): Promise<{ count: number }> {
    return this.memberService.mappingMajorSkill(member, params);
  }

  @ApiMappingMemberSkills('해당 member 와 memberSkill 을 다중 연결합니다.')
  @AllowMemberStatusesSetMetadataGuard([MemberStatus.Active])
  @OwnMemberSetMetadataGuard()
  @UseGuards(JwtAuthGuard)
  @Post(':id/member-skills/:memberSkillIds')
  mappingMemberSkills(
    @SetModelNameToParam(ModelName.Member)
    @Param()
    params: CreateMemberSkillsMappingRequestParamDto,
  ): Promise<Prisma.BatchPayload> {
    return this.memberService.mappingMemberSkills(params);
  }

  @ApiUnmappingMemberSkills(
    '해당 member 와 memberSkill 을 다중 연결 제거합니다.',
  )
  @AllowMemberStatusesSetMetadataGuard([MemberStatus.Active])
  @OwnMemberSetMetadataGuard()
  @UseGuards(JwtAuthGuard)
  @Delete(':id/member-skills/:memberSkillIds')
  unmappingMemberSkills(
    @SetModelNameToParam(ModelName.Member)
    @Param()
    params: DeleteMemberSkillsMappingRequestParamDto,
  ): Promise<Prisma.BatchPayload> {
    return this.memberService.unmappingMemberSkills(params);
  }

  @ApiMappingMemberInterests(
    '해당 member 와 memberInterest 를 다중 매핑합니다.',
  )
  @AllowMemberStatusesSetMetadataGuard([MemberStatus.Active])
  @OwnMemberSetMetadataGuard()
  @UseGuards(JwtAuthGuard)
  @Post(':id/member-interests/:memberInterestIds')
  mappingMemberInterests(
    @SetModelNameToParam(ModelName.Member)
    @Param()
    params: CreateMemberInterestMappingRequestParamDto,
  ): Promise<Prisma.BatchPayload> {
    return this.memberService.mappingMemberInterests(params);
  }

  @ApiUnmappingMemberInterests(
    '해당 member 와 memberInterest 를 다중 연결 제거합니다..',
  )
  @AllowMemberStatusesSetMetadataGuard([MemberStatus.Active])
  @OwnMemberSetMetadataGuard()
  @UseGuards(JwtAuthGuard)
  @Delete(':id/member-interests/:memberInterestIds')
  unmappingMemberInterests(
    @SetModelNameToParam(ModelName.Member)
    @Param()
    params: DeleteMemberInterestMappingRequestParamDto,
  ): Promise<Prisma.BatchPayload> {
    return this.memberService.unmappingMemberInterests(params);
  }
}
