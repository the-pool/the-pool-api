import { PrismaClient } from '@prisma/client';
import { getValueByEnum } from '../src/common/common';
import { lessonCategorySeed } from './functions/lesson-category.seed';
import { lessonHashtagSeed } from './functions/lesson-hashtag.seed';
import { lessonLevelSeed } from './functions/lesson-level.seed';
import { majorSkillSeed } from './functions/major-skill.seed';
import { majorSeed } from './functions/major.seed';
import { memberInterestSeed } from './functions/member-interest.seed';
import { questionCategorySeed } from './functions/question-category.seed';

// initialize Prisma Client
const prisma = new PrismaClient();

/**
 * seed 파일에서 사용되는 createMany의 data자리에 들어갈 값을 만드는 메서드
 * { id : 1, fieldName : "값" } 형식을 사용되며
 * getValueByEnum을 사용하기 때문에 fieldName에 value로 들어갈 자료형을 함께 넘겨주어야 함.
 */
export const createDataForSeed = (
  Enum: Record<string, string | number>,
  type: 'number' | 'string',
  fieldName: string,
): { id: number; [fieldName: string]: string | number }[] => {
  return getValueByEnum(Enum, type).map((fieldValue, idx) => {
    return { id: ++idx, [fieldName]: fieldValue };
  });
};

/**
 * the pool seed
 */
async function thePoolSeed() {
  await lessonCategorySeed(prisma);
  await lessonLevelSeed(prisma);
  await lessonHashtagSeed(prisma);
  await majorSeed(prisma);
  await majorSeed(prisma);
  await memberInterestSeed(prisma);
  await majorSkillSeed(prisma);
  await questionCategorySeed(prisma);
}

thePoolSeed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // close Prisma Client at the end
    await prisma.$disconnect();
  });
