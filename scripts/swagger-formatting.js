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
  return `export const ${methodName} = (summary: string) => {
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
const moduleName = options.module;
const controllerName = options.Controller || moduleName;
const controllerFileName = controllerName + '.controller.ts';

let dir = __dirname.split('/');
dir.pop();
dir = path.join(dir.join('/'), 'src', 'modules', options.module, 'controllers');

const swaggerFilePath = dir + '/' + controllerName + '.swaggerasd.ts';
const controllerPath = path.join(dir, controllerFileName);

fs.readFile(controllerPath, 'utf8', (err, data) => {
  if (err) {
    console.error('존재하지 않는 컨트롤러');
    console.error(err);
    return;
  }

  const toCreateMethod = {};
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

  controllerMethodNames.forEach((controllerMethodName) => {
    toCreateMethod[getSwaggerMethodName(controllerMethodName)] = undefined;
  });

  let description;
  let swaggerFile;
  const createMethodNames = [];

  try {
    swaggerFile = fs.readFileSync(swaggerFilePath, 'utf8');
  } catch (e) {}

  if (swaggerFile) {
    const existSwaggerMethod = {};

    swaggerFile.split('export const').map((el, idx) => {
      if (idx === 0) {
        el = el.slice(0, -1);
        description = el;

        return;
      }

      if (el.slice(-2) === '\n\n') {
        el = el.slice(0, -1);
      }

      existSwaggerMethod[[el.split('=')[0].trim()]] = 'export const' + el;
    });

    for (const toCreateMethodName in toCreateMethod) {
      if (existSwaggerMethod[toCreateMethodName]) {
        toCreateMethod[toCreateMethodName] =
          existSwaggerMethod[toCreateMethodName];
      } else {
        toCreateMethod[toCreateMethodName] =
          getSwaggerFormat(toCreateMethodName);
        createMethodNames.push(toCreateMethodName);
      }
    }

    for (const toCreateMethodName in toCreateMethod) {
      description += '\n' + toCreateMethod[toCreateMethodName];
    }
  } else {
    description = getBaseImport();

    controllerMethodNames.forEach((methodName) => {
      const swaggerMethodName = getSwaggerMethodName(methodName);

      description += '\n' + getSwaggerFormat(swaggerMethodName);
      createMethodNames.push(getSwaggerMethodName(methodName));
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
