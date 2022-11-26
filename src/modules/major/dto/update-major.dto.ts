import { PartialType } from '@nestjs/swagger';
import { CreateMajorDto } from './create-major.dto';

export class UpdateMajorDto extends PartialType(CreateMajorDto) {}
