export const lessonCategorySeed = async (prisma) => {
  enum DevelopCategoryName {
    Backend = '백엔드개발',
    WebFrontend = '웹 프론트엔드',
    Ios = 'IOS',
    Android = 'Android',
    Etc = '기타 개발',
  }

  enum DesignCategoryName {
    WebDesign = '웹 디자인',
    UiUx = 'UI/UX',
    Bx = 'BX',
    Etc = '기타 디자인',
  }

  await prisma.lessonCategory.createMany({
    data: [
      {
        id: 1,
        name: DevelopCategoryName.Backend,
      },
      {
        id: 2,
        name: DevelopCategoryName.WebFrontend,
      },
      {
        id: 4,
        name: DevelopCategoryName.Android,
      },
      {
        id: 3,
        name: DevelopCategoryName.Ios,
      },
      {
        id: 5,
        name: DevelopCategoryName.Etc,
      },
      {
        id: 6,
        name: DesignCategoryName.WebDesign,
      },
      {
        id: 7,
        name: DesignCategoryName.UiUx,
      },
      {
        id: 8,
        name: DesignCategoryName.Bx,
      },
      {
        id: 9,
        name: DesignCategoryName.Etc,
      },
    ],
    skipDuplicates: true,
  });
};
