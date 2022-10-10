import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateUserRequestBodyDto } from '../dto/create-user-request-body.dto';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  IntersectionType,
} from '@nestjs/swagger';
import { UserResponseType } from '@src/modules/user/types/response/success/user-response.type';
import { IdRequestParamDto } from '@src/dtos/id-request-param.dto';
import { User } from '@prisma/client';
import { AccessTokenType } from '@src/modules/user/types/access-token.type';
import { SetModelNameToParam } from '@src/decorators/set-model-name-to-param.decorator';
import { ModelName } from '@src/constants/enum';

@ApiTags('유저')
@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: '유저 생성' })
  @ApiCreatedResponse({
    type: IntersectionType(UserResponseType, AccessTokenType),
  })
  create(
    @Body() createUserDto: CreateUserRequestBodyDto,
  ): Promise<UserResponseType> {
    return this.userService.create(createUserDto);
  }

  @Get(':id')
  @ApiOperation({ summary: '유저 조회' })
  @ApiOkResponse({ type: UserResponseType })
  findOne(
    @Param() @SetModelNameToParam(ModelName.User) param: IdRequestParamDto,
  ): Promise<Omit<User, 'password'>> {
    return this.userService.findOne(param.id);
  }
}
