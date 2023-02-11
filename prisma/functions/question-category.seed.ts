export const questionCategorySeed = async (prisma) => {
  enum CategoryName {
    Etc = '기타',
    Develoment = '개발',
    Design = '디자인',
    Career = '커리어',
    WorkLife = '직장생활'
  }

  await prisma.questionCategory.createMany({
    data: Object.values(CategoryName)
      .map((value, idx) => ({ id: ++idx, name: value })),
    skipDuplicates: true,
  });
};
