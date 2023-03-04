import { PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';
import { CommentEntity } from '../entities/lesson-comment.entity';

export class CreateCommentDto extends PickType(CommentEntity, ['description']) {
  // 댓글 길이에 관한 정책이 정해지면 Length 데코레이터가 추가되야 함
  @IsString()
  @IsNotEmpty()
  description: string;
}
