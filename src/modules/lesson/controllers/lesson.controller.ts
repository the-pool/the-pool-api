import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserLogin } from '@src/decorators/user-login.decorator';
import { CreateLessonDto } from '../dtos/create-lesson.dto';

@ApiTags('과제')
@Controller('api/lessons')
export class LessonController {
  constructor() {}

  @Post()
  @ApiOperation({ summary: '과제 생성' })
  @UseGuards(AuthGuard('jwt'))
  createLesson(
    @Body() createLessonDto: CreateLessonDto,
    @UserLogin('id') memberId: number,
  ) {
    console.log(memberId);
    console.log(createLessonDto);
  }
}
