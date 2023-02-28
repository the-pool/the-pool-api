import { applyDecorators } from "@nestjs/common";
import { ApiCreatedResponse, ApiOkResponse, ApiOperation } from "@nestjs/swagger";
import { SolutionEntity } from "../entities/solution.entity";

export const ApiCreateSolution = (summary: string) => applyDecorators(
  ApiOperation({ summary }),
  ApiCreatedResponse({ type: SolutionEntity })
);