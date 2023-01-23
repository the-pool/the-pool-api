// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Command } = require('commander');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

const getSwaggerMethodName = (methodName) => {
  return 'Api' + methodName.slice(0, 1).toUpperCase() + methodName.slice(1);
};

const getSwaggerFormat = (methodName) => {
  return `
export const ${methodName} = (summary: string) => {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiSuccessResponse(HttpStatus.OK, {}),
    ApiFailureResponse(HttpStatus.BAD_REQUEST, []),
  );
};
`;
};

const getBaseImport = () => {
  return `import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ApiFailureResponse } from '@src/decorators/api-failure-response.decorator';
import { ApiSuccessResponse } from '@src/decorators/api-success-response.decorator';
`;
};

const program = new Command();

program
  .description(
    `컨트롤러 기준으로 controller.swagger.ts 를 생성해줍니다.
-m 은 필수 옵션이고 -c 를 주지 않는다면 module name 기준으로 컨트롤러를 찾습니다.
ex) npm run swagger -m "member" => member.controller.ts 를 찾아 member.swagger.ts 를 생성합니다.
ex) npm run swagger -m "member" -c "member-like" => member module 안에있는 member-like.controller.ts 를 찾아 member-like.swagger.ts 를 생성합니다.`,
  )
  .requiredOption('-m, --module <module>', 'module name')
  .option('-c, --controller <controller>', 'controller name')
  .parse();

const options = program.opts();
console.log(options);
const moduleName = options.module;
const controllerName = options.Controller || moduleName;
const controllerFileName = controllerName + '.controller.ts';

let dir = __dirname.split('/');
dir.pop();
dir = path.join(dir.join('/'), 'src', 'modules', options.module, 'controllers');

const swaggerFilePath = dir + '/' + controllerName + '.swaggera.ts';
const controllerPath = path.join(dir, controllerFileName);

fs.readFile(controllerPath, 'utf8', (err, data) => {
  if (err) {
    console.error('존재하지 않는 컨트롤러');
    console.error(err);
    return;
  }

  const controllerMethodNames = data
    .match(/^(  [a-z].{0,})/gm)
    .map((el) => {
      return el.replace(/ /g, '').split('(')[0];
    })
    .filter((el) => {
      return el !== 'constructor';
    })
    .map((el) => {
      return el.replace(/async/g, '');
    });

  let description;
  let swaggerFile;
  let createMethodNames;

  try {
    swaggerFile = fs.readFileSync(swaggerFilePath, 'utf8');
  } catch (e) {}

  if (swaggerFile) {
    const existMethodNames = swaggerFile
      .match(/^export const.{0,}/gm)
      .map((str) => {
        return str.split(' ')[2];
      });

    const swaggerMethodNames = controllerMethodNames.map((methodName) => {
      return getSwaggerMethodName(methodName);
    });

    createMethodNames = swaggerMethodNames.filter((swaggerMethodName) => {
      return !existMethodNames.includes(swaggerMethodName);
    });

    description = swaggerFile;

    createMethodNames.forEach((createMethodName) => {
      description += getSwaggerFormat(createMethodName);
    });
  } else {
    description = getBaseImport();

    createMethodNames = controllerMethodNames;

    controllerMethodNames.forEach((methodName) => {
      const swaggerMethodName = getSwaggerMethodName(methodName);

      description += getSwaggerFormat(swaggerMethodName);
    });
  }

  fs.writeFile(swaggerFilePath, description, (err) => {
    if (err) {
      console.error(err);
    } else {
      if (swaggerFile) {
        console.log('file:', swaggerFilePath);
        console.log('created method:', createMethodNames);
      } else {
        console.log('created file:', swaggerFilePath);
        console.log('created method:', createMethodNames);
      }
    }
  });
});
