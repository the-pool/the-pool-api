import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  IntersectionType,
} from '@nestjs/swagger';
import { UserResponseType } from '@src/modules/user/types/response/success/user-response.type';
import { IdParamDto } from '@src/dtos/id-param.dto';
import { User } from '@prisma/client';
import { AccessTokenType } from '@src/modules/user/types/access-token.type';

@ApiTags('유저')
@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: '유저 생성' })
  @ApiCreatedResponse({
    type: IntersectionType(UserResponseType, AccessTokenType),
  })
  create(@Body() createUserDto: CreateUserDto): Promise<UserResponseType> {
    return this.userService.create(createUserDto);
  }

  @Get(':id')
  @ApiOperation({ summary: '유저 조회' })
  @ApiOkResponse({ type: UserResponseType })
  findOne(@Param() param: IdParamDto): Promise<Omit<User, 'password'>> {
    return this.userService.findOne(param.id);
  }
}
