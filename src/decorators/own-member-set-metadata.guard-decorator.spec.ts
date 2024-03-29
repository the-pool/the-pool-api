import { faker } from '@faker-js/faker';
import { UseGuards } from '@nestjs/common';
import { SetMetadata } from '@nestjs/common/decorators/core/set-metadata.decorator';
import { OwnMemberSetMetadataGuard } from '@src/decorators/own-member-set-metadata.guard-decorator';
import { OwnMemberGuard } from '@src/guards/own-member.guard';
import { OWN_MEMBER_FIELD_NAME } from '@src/modules/member/constants/member.const';

jest.mock('@nestjs/common/decorators/core/set-metadata.decorator');
jest.mock('@nestjs/common/decorators/core/use-guards.decorator');

describe('OwnMemberSetMetadataGuard', () => {
  it('fieldName 을 주지 않았을 경우', () => {
    OwnMemberSetMetadataGuard();

    expect(SetMetadata).toBeCalledWith(OWN_MEMBER_FIELD_NAME, 'id');
    expect(UseGuards).toBeCalledWith(OwnMemberGuard);
  });

  it('fieldName 을 주었을 경우', () => {
    const fieldName = faker.datatype.string();

    OwnMemberSetMetadataGuard(fieldName);

    expect(SetMetadata).toBeCalledWith(OWN_MEMBER_FIELD_NAME, fieldName);
    expect(UseGuards).toBeCalledWith(OwnMemberGuard);
  });
});
