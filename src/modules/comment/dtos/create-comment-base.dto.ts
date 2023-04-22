import { PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { CommentBaseEntity } from '../entities/comment.entity';

export class CreateCommentBaseDto extends PickType(CommentBaseEntity, [
  'description',
]) {
  @MaxLength(500)
  @IsString()
  @IsNotEmpty()
  description: string;
}
