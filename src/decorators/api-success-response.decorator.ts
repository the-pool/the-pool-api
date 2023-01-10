import { applyDecorators, HttpCode, HttpStatus, Type } from '@nestjs/common';
import { ErrorHttpStatusCode } from '@nestjs/common/utils/http-error-by-code.util';
import {
  ApiExtraModels,
  ApiResponse,
  ApiResponseMetadata,
  ApiResponseSchemaHost,
  getSchemaPath,
} from '@nestjs/swagger';
import {
  ReferenceObject,
  SchemaObject,
} from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

const getEntriesByEnum = <T>(Enum: {
  [key in keyof T]: T[key];
}): T => {
  const entries = Object.entries(Enum);
  entries.splice(0, entries.length / 2);

  return entries.reduce((acc, cur) => {
    acc[cur[0]] = cur[1];
    return acc;
  }, {}) as T;
};

const getNumberEnumValues = (numberEnum: {
  [key: string]: string | number;
}): (number | string)[] => {
  return Object.values(numberEnum).filter((v) => Number.isInteger(v));
};

const getStrMapByEnum = (Enum) => {
  const map = getEntriesByEnum<typeof Enum>(Enum);
  let mapStr = '{ ';

  for (const key in map) {
    mapStr += key + ': ' + map[key] + ', ';
  }

  return mapStr + ' }';
};

type OptionalProperty = {
  isArray?: boolean;
  nullable?: boolean;
  deprecated?: boolean;
  title?: string;
  description?: string;
  maxLength?: number;
  minLength?: number;
  maxItems?: number;
  minItems?: number;
  uniqueItems?: boolean;
  maxProperties?: number;
  minProperties?: number;
  enum?: any[];
  default?: any;
};

type Reference = OptionalProperty & {
  type: Type<unknown>;
};

type Primitive = OptionalProperty & {
  type: string | Record<string, any>;
  example?: any;
};

/**
 * 성공에 대한 응답을 swagger상에 보여주고 싶은데 필드명을 커스텀 하고 싶을 때
 * 사용하는 데코레이터이며 원하는데로 필드와 타입을 지정해 줄 수 있다.
 */

export const ApiSuccessResponse = (
  status: Exclude<HttpStatus, ErrorHttpStatusCode>,
  referenceType: Record<string, Reference>,
  primitiveType?: Record<string, Primitive>,
) => {
  const extraModels: Type<unknown>[] = [];
  const properties: Record<string, SchemaObject | ReferenceObject> = {};
  const apiResponseOption: ApiResponseMetadata | ApiResponseSchemaHost = {
    status,
    schema: {},
  };

  Object.entries(referenceType).forEach(([key, value]) => {
    const { type, isArray, ...additionalField } = value;

    if (isArray) {
      properties[key] = {
        type: 'array',
        ...additionalField,
        items: {
          type: 'object',
          $ref: getSchemaPath(type),
        },
      };
    } else {
      delete additionalField.maxItems;
      delete additionalField.minItems;
      delete additionalField.maxProperties;
      delete additionalField.minProperties;
      delete additionalField.uniqueItems;

      properties[key] = {
        ...additionalField,
        $ref: getSchemaPath(type),
      };
    }

    extraModels.push(type);
  });

  if (primitiveType) {
    Object.entries(primitiveType).forEach(([key, value]) => {
      const { type, isArray, ...additionalField } = value;
      const options: SchemaObject = {};

      if (typeof type === 'string') {
        options.type = type;
      } else {
        options.pattern = getStrMapByEnum(type);
        options.enum = getNumberEnumValues(type);
        options.type = 'enum';
      }

      if (isArray) {
        properties[key] = {
          type: 'array',
          ...additionalField,
          items: {
            ...options,
          },
        };
      } else {
        delete additionalField.maxItems;
        delete additionalField.minItems;
        delete additionalField.maxProperties;
        delete additionalField.minProperties;
        delete additionalField.uniqueItems;

        properties[key] = {
          ...additionalField,
          ...options,
        };
      }
    });
  }

  apiResponseOption.schema.properties = properties;

  return applyDecorators(
    HttpCode(status),
    ApiExtraModels(...extraModels),
    ApiResponse(apiResponseOption),
  );
};
