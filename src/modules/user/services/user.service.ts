import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import bcrypt from 'bcrypt';
import { AuthService } from '@src/modules/core/auth/services/auth.service';
import { UserResponseType } from '@src/modules/user/types/response/success/user-response.type';
import { User } from '@prisma/client';
import { AccessTokenType } from '@src/modules/user/types/access-token.type';

@Injectable()
export class UserService {
  private readonly SALT = 10;

  constructor(
    private readonly prismaService: PrismaService,
    private readonly authService: AuthService,
  ) {}

  async create(
    createUserDto: CreateUserDto,
  ): Promise<UserResponseType & AccessTokenType> {
    createUserDto.password = await bcrypt.hash(
      createUserDto.password,
      this.SALT,
    );

    const { password, ...user }: User & AccessTokenType =
      await this.prismaService.user.create({
        data: createUserDto,
      });

    user.accessToken = this.authService.login(user.id);

    return user;
  }

  async findOne(id: number): Promise<Omit<User, 'password'>> {
    const { password, ...user }: User = await this.prismaService.user.findFirst(
      {
        where: {
          id,
        },
      },
    );

    return user;
  }
}
