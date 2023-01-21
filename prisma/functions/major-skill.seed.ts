export const majorSkillSeed = async (prisma) => {
  enum DevelopMajorSkillName {
    Backend = '백엔드개발',
    WebFrontend = '웹 프론트엔드',
    Ios = 'IOS',
    Android = 'Android',
    Etc = '기타 개발',
  }

  enum DesignMajorSkillName {
    WebDesign = '웹 디자인',
    UiUx = 'UI/UX',
    Bx = 'BX',
    Etc = '기타 디자인',
  }

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
};
