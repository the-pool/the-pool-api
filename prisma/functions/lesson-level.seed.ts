export const lessonLevelSeed = async (prisma) => {
  enum LessonLevel {
    Top = '상',
    Middle = '중',
    Bottom = '하',
  }

  await prisma.lessonLevel.createMany({
    data: [
      { level: LessonLevel.Top },
      { level: LessonLevel.Middle },
      { level: LessonLevel.Bottom },
    ],
    skipDuplicates: true,
  });
};
