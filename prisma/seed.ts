import { PrismaClient } from '@prisma/client';
import { lessonCategorySeed } from './functions/lesson-category.seed';
import { lessonLevelSeed } from './functions/lesson-level.seed';
import { majorSkillSeed } from './functions/major-skill.seed';
import { majorSeed } from './functions/major.seed';
import { memberInterestSeed } from './functions/member-interest.seed';
import { questionCategorySeed } from './functions/question-category.seed';

// initialize Prisma Client
const prisma = new PrismaClient();

/**
 * the pool seed
 */
async function thePoolSeed() {
  await lessonCategorySeed(prisma);
  await lessonLevelSeed(prisma);
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
