import { applyDecorators } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";

export const ApiCreateSolution = (summary: string) => applyDecorators(
  ApiOperation({ summary }),

);