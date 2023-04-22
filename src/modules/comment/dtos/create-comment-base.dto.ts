import { PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { CommentBaseEntity } from '../entities/comment.entity';

export class CreateCommentBaseDto extends PickType(CommentBaseEntity, [
  'description',
]) {
  // 댓글 길이에 관한 정책이 정해지면 Length 데코레이터가 추가되야 함
  @MaxLength(500)
  @IsString()
  @IsNotEmpty()
  description: string;
}
