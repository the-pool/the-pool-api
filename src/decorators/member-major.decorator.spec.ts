import { SetMetadata, UseGuards } from '@nestjs/common';
import { MajorId } from '@src/constants/enum';
import { MemberMajor } from '@src/decorators/member-major.decorator';
import { MemberMajorGuard } from '@src/guards/member-major.guard';
import { MEMBER_JOBS } from '@src/modules/member/constants/member.const';

jest.mock('@nestjs/common/decorators/core/set-metadata.decorator');
jest.mock('@nestjs/common/decorators/core/use-guards.decorator');

describe('MemberMajor', () => {
  it('아무값을 주지 않았을 때', () => {
    MemberMajor();

    expect(SetMetadata).toBeCalledWith(MEMBER_JOBS, []);
    expect(UseGuards).toBeCalledWith(MemberMajorGuard);
  });

  it('인자를 넘겨줬을 때', () => {
    MemberMajor(MajorId.Development);

    expect(SetMetadata).toBeCalledWith(MEMBER_JOBS, [MajorId.Development]);
    expect(UseGuards).toBeCalledWith(MemberMajorGuard);
  });
});
