import { faker } from '@faker-js/faker';
import { UseGuards } from '@nestjs/common';
import { SetMetadata } from '@nestjs/common/decorators/core/set-metadata.decorator';
import { UnOwnMemberSetMetadataGuard } from '@src/decorators/un-own-member-set-metadata.guard-decorator';
import { UnOwnMemberGuard } from '@src/guards/un-own-member.guard';
import { UN_OWN_MEMBER_FIELD_NAME } from '@src/modules/member/constants/member.const';

jest.mock('@nestjs/common/decorators/core/set-metadata.decorator');
jest.mock('@nestjs/common/decorators/core/use-guards.decorator');

describe('UnOwnMemberSetMetadataGuard', () => {
  it('fieldName 을 주지 않았을 경우', () => {
    UnOwnMemberSetMetadataGuard();

    expect(SetMetadata).toBeCalledWith(UN_OWN_MEMBER_FIELD_NAME, 'id');
    expect(UseGuards).toBeCalledWith(UnOwnMemberGuard);
  });

  it('fieldName 을 주었을 경우', () => {
    const fieldName = faker.datatype.string();

    UnOwnMemberSetMetadataGuard(fieldName);

    expect(SetMetadata).toBeCalledWith(UN_OWN_MEMBER_FIELD_NAME, fieldName);
    expect(UseGuards).toBeCalledWith(UnOwnMemberGuard);
  });
});
