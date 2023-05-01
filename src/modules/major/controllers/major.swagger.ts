import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ApiFailureResponse } from '@src/decorators/api-failure-response.decorator';
import { ApiSuccessResponse } from '@src/decorators/api-success-response.decorator';
import { MajorSkillDto } from '@src/modules/major/dtos/major-skill-dto';
import { MajorDto } from '@src/modules/major/dtos/major.dto';

export const ApiFindAllMajor = (summary: string) => {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiSuccessResponse(HttpStatus.OK, {
      majors: {
        type: MajorDto,
        isArray: true,
      },
    }),
    ApiFailureResponse(HttpStatus.BAD_REQUEST, []),
  );
};

export const ApiFindOneMajor = (summary: string) => {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiSuccessResponse(HttpStatus.OK, {
      major: {
        type: MajorDto,
      },
    }),
    ApiFailureResponse(HttpStatus.BAD_REQUEST, []),
  );
};

export const ApiFindAllMajorSkill = (summary: string) => {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiSuccessResponse(HttpStatus.OK, {
      majorSkills: {
        type: MajorSkillDto,
        isArray: true,
      },
    }),
    ApiFailureResponse(HttpStatus.BAD_REQUEST, []),
  );
};

export const ApiFindOneMajorSkill = (summary: string) => {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiSuccessResponse(HttpStatus.OK, {
      majorSkill: {
        type: MajorSkillDto,
      },
    }),
    ApiFailureResponse(HttpStatus.BAD_REQUEST, []),
  );
};
