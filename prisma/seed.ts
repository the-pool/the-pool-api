// prisma/seed.ts

import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';

// initialize Prisma Client
const prisma = new PrismaClient();

enum DevelopMajorSkillName {
  Backend = '백엔드개발',
  WebFrontend = '웹 프론트엔드',
  Ios = 'iOS',
  Android = 'Android',
  Etc = '기타 개발',
}

enum DesignMajorSkillName {
  WebDesign = '웹 디자인',
  UiUx = 'UI/UX',
  Bx = 'BX',
  Etc = '기타 디자인',
}

enum LessonLevel {
  Top = '상',
  Middle = '중',
  Bottom = '하',
}

/**
 * the pool seed
 */
async function thePoolSeed() {
  // Major Seed
  const design = '디자인';
  const develop = '개발';
  // 모델 필요
  // Major Seed
  await prisma.major.createMany({
    data: [
      {
        id: 1,
        name: develop,
      },
      {
        id: 2,
        name: design,
      },
    ],
    skipDuplicates: true,
  });

  // MajorSkill Seed
  await prisma.majorSkill.createMany({
    data: [
      {
        id: 1,
        majorId: 1,
        name: DevelopMajorSkillName.Backend,
      },
      {
        id: 2,
        majorId: 1,
        name: DevelopMajorSkillName.WebFrontend,
      },
      {
        id: 4,
        majorId: 1,
        name: DevelopMajorSkillName.Android,
      },
      {
        id: 3,
        majorId: 1,
        name: DevelopMajorSkillName.Ios,
      },
      {
        id: 5,
        majorId: 1,
        name: DevelopMajorSkillName.Etc,
      },
      {
        id: 6,
        majorId: 2,
        name: DesignMajorSkillName.WebDesign,
      },
      {
        id: 7,
        majorId: 2,
        name: DesignMajorSkillName.UiUx,
      },
      {
        id: 8,
        majorId: 2,
        name: DesignMajorSkillName.Bx,
      },
      {
        id: 9,
        majorId: 2,
        name: DesignMajorSkillName.Etc,
      },
    ],
    skipDuplicates: true,
  });

  await prisma.lessonLevel.createMany({
    data: [
      { level: LessonLevel.Top },
      { level: LessonLevel.Middle },
      { level: LessonLevel.Bottom },
    ],
    skipDuplicates: true,
  });
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
