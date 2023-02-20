import { faker } from '@faker-js/faker';
import { UseGuards } from '@nestjs/common';
import { SetMetadata } from '@nestjs/common/decorators/core/set-metadata.decorator';
import { OtherMemberSetMetadataGuard } from '@src/decorators/other-member-set-metadata.guard-decorator';
import { OtherMemberGuard } from '@src/guards/other-member.guard';
import { UN_OWN_MEMBER_FIELD_NAME } from '@src/modules/member/constants/member.const';

jest.mock('@nestjs/common/decorators/core/set-metadata.decorator');
jest.mock('@nestjs/common/decorators/core/use-guards.decorator');

describe('OtherMemberSetMetadataGuard', () => {
  it('fieldName 을 주지 않았을 경우', () => {
    OtherMemberSetMetadataGuard();

    expect(SetMetadata).toBeCalledWith(UN_OWN_MEMBER_FIELD_NAME, 'id');
    expect(UseGuards).toBeCalledWith(OtherMemberGuard);
  });

  it('fieldName 을 주었을 경우', () => {
    const fieldName = faker.datatype.string();

    OtherMemberSetMetadataGuard(fieldName);

    expect(SetMetadata).toBeCalledWith(UN_OWN_MEMBER_FIELD_NAME, fieldName);
    expect(UseGuards).toBeCalledWith(OtherMemberGuard);
  });
});
