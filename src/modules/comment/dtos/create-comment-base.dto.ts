import { PickType } from '@nestjs/swagger';
import { CommentBaseEntity } from '@src/modules/comment/entities/comment.entity';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateCommentBaseDto extends PickType(CommentBaseEntity, [
  'description',
]) {
  @MaxLength(500)
  @IsString()
  @IsNotEmpty()
  description: string;
}
