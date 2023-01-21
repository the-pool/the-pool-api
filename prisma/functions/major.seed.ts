export const majorSeed = async (prisma) => {
  // Major Seed
  const design = '디자인';
  const develop = '개발';

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
};
