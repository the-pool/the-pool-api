import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import bcrypt from 'bcrypt';
import { AuthService } from '@src/modules/core/auth/services/auth.service';
import { CreateUserResponseType } from '@src/modules/user/types/response/success/create-user-response.type';

@Injectable()
export class UserService {
  private readonly SALT = 10;

  constructor(
    private readonly prismaService: PrismaService,
    private readonly authService: AuthService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<CreateUserResponseType> {
    createUserDto.password = await bcrypt.hash(
      createUserDto.password,
      this.SALT,
    );

    const { password, ...user }: { password: string } & CreateUserResponseType =
      await this.prismaService.user.create({
        data: createUserDto,
      });

    user.accessToken = this.authService.login(user.id);

    return user;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
