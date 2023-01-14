import { faker } from '@faker-js/faker';

/**
 * 우선 mock data 넣고 정해지면 수정
 */
export const memberInterestSeed = async (prisma) => {
  const memberInterestName = 'memberInterest';

  await prisma.memberInterest.createMany({
    data: [
      {
        name: memberInterestName + faker.datatype.string(10),
      },
      {
        name: memberInterestName + faker.datatype.string(10),
      },
      {
        name: memberInterestName + faker.datatype.string(10),
      },
      {
        name: memberInterestName + faker.datatype.string(10),
      },
      {
        name: memberInterestName + faker.datatype.string(10),
      },
      {
        name: memberInterestName + faker.datatype.string(10),
      },
      {
        name: memberInterestName + faker.datatype.string(10),
      },
      {
        name: memberInterestName + faker.datatype.string(10),
      },
      {
        name: memberInterestName + faker.datatype.string(10),
      },
      {
        name: memberInterestName + faker.datatype.string(10),
      },
      {
        name: memberInterestName + faker.datatype.string(10),
      },
      {
        name: memberInterestName + faker.datatype.string(10),
      },

      {
        name: memberInterestName + faker.datatype.string(10),
      },
      {
        name: memberInterestName + faker.datatype.string(10),
      },
      {
        name: memberInterestName + faker.datatype.string(10),
      },
    ],
    skipDuplicates: true,
  });
};
