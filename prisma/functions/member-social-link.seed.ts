import { PrismaClient } from '@prisma/client';

export const memberSocialLinkSeed = async (prisma: PrismaClient) => {
  const directoryPath = 'uploads/member-sns-icon';

  // Member Social Link Seed
  await prisma.memberSocialLink.createMany({
    data: [
      {
        id: 1,
        name: 'etc',
        iconPath: directoryPath + '/' + 'etc.svg',
      },
      {
        id: 2,
        name: 'instagram',
        iconPath: directoryPath + '/' + 'instagram.svg',
      },
      {
        id: 3,
        name: 'behance',
        iconPath: directoryPath + '/' + 'behance.svg',
      },
      {
        id: 4,
        name: 'notion',
        iconPath: directoryPath + '/' + 'notion.svg',
      },
      {
        id: 5,
        name: 'linkedin',
        iconPath: directoryPath + '/' + 'linkedin.svg',
      },
      {
        id: 6,
        name: 'github',
        iconPath: directoryPath + '/' + 'github.svg',
      },
    ],
    skipDuplicates: true,
  });
};
