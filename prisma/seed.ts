// prisma/seed.ts

import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';

// initialize Prisma Client
const prisma = new PrismaClient();

/**
 * example code seed
 */
async function codeBaseSeed() {
  const SALT = 10;

  for (let i = 0; i < 500; i += 1) {
    const email = faker.internet.email();
    const name = faker.name.fullName();
    const role = Number(faker.datatype.boolean());
    const password = await bcrypt.hash(faker.internet.password(), SALT);

    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        name,
        role,
        password,
      },
    });

    console.log(user);

    const randomNumber = +faker.random.numeric(1);

    for (let j = 0; j < randomNumber; j += 1) {
      const published = faker.datatype.boolean();
      const title = faker.random.words(3);
      const description = faker.random.words(10);

      const post = await prisma.post.create({
        data: {
          title,
          published,
          description,
          updatedAt: new Date(),
          authorId: user.id,
          updatedAt: new Date(),
        },
      });

      console.log(post);
    }
  }
}

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
        name: develop,
      },
      {
        name: design,
      },
    ],
  });

  await prisma.mainSkill.createMany({
    data: [
      {
        majorId: 1,
        name: DevelopMajorSkillName.Backend,
      },
      {
        majorId: 1,
        name: DevelopMajorSkillName.WebFrontend,
      },
      {
        majorId: 1,
        name: DevelopMajorSkillName.Android,
      },
      {
        majorId: 1,
        name: DevelopMajorSkillName.Ios,
      },
      {
        majorId: 1,
        name: DevelopMajorSkillName.Etc,
      },
      {
        majorId: 2,
        name: DesignMajorSkillName.WebDesign,
      },
      {
        majorId: 2,
        name: DesignMajorSkillName.UiUx,
      },
      {
        majorId: 2,
        name: DesignMajorSkillName.Bx,
      },
      {
        majorId: 2,
        name: DesignMajorSkillName.Etc,
      },
    ],
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

// execute the main function
codeBaseSeed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // close Prisma Client at the end
    await prisma.$disconnect();
  });
