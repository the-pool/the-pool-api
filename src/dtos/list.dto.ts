import { ApiProperty } from "@nestjs/swagger";


export class ListDto<T> {
  @ApiProperty({
    description: '전체 갯수'
  })
  totalCount: number;

  @ApiProperty({
    description: '응답 객체 리스트'
  })
  list: T[]
}