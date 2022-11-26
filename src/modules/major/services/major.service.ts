import { Injectable } from '@nestjs/common';
import { CreateMajorDto } from '../dto/create-major.dto';
import { UpdateMajorDto } from '../dto/update-major.dto';

@Injectable()
export class MajorService {
  create(createMajorDto: CreateMajorDto) {
    return 'This action adds a new major';
  }

  findAll() {
    return `This action returns all major`;
  }

  findOne(id: number) {
    return `This action returns a #${id} major`;
  }

  update(id: number, updateMajorDto: UpdateMajorDto) {
    return `This action updates a #${id} major`;
  }

  remove(id: number) {
    return `This action removes a #${id} major`;
  }
}
