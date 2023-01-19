import { faker } from '@faker-js/faker';

/**
 * 우선 mock data 넣고 정해지면 수정
 */
export const memberSkillSeed = async (prisma) => {
  const memberSkillName = 'memberSkill';

  await prisma.memberSkill.createMany({
    data: [
      {
        name: memberSkillName + faker.datatype.string(10),
      },
      {
        name: memberSkillName + faker.datatype.string(10),
      },
      {
        name: memberSkillName + faker.datatype.string(10),
      },
      {
        name: memberSkillName + faker.datatype.string(10),
      },
      {
        name: memberSkillName + faker.datatype.string(10),
      },
      {
        name: memberSkillName + faker.datatype.string(10),
      },
      {
        name: memberSkillName + faker.datatype.string(10),
      },
      {
        name: memberSkillName + faker.datatype.string(10),
      },
      {
        name: memberSkillName + faker.datatype.string(10),
      },
      {
        name: memberSkillName + faker.datatype.string(10),
      },
      {
        name: memberSkillName + faker.datatype.string(10),
      },
      {
        name: memberSkillName + faker.datatype.string(10),
      },
      {
        name: memberSkillName + faker.datatype.string(10),
      },
      {
        name: memberSkillName + faker.datatype.string(10),
      },
    ],
    skipDuplicates: true,
  });
};
