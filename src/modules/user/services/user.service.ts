import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import bcrypt from 'bcrypt';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  private readonly SORT = 10;

  constructor(private readonly prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    createUserDto.password = await bcrypt.hash(
      createUserDto.password,
      this.SORT,
    );

    const user = await this.prismaService.user.create({
      data: createUserDto,
    });

    delete user.password;

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
