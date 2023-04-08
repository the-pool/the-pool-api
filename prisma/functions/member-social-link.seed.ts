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
        socialDomain: '',
      },
      {
        id: 2,
        name: 'instagram',
        iconPath: directoryPath + '/' + 'instagram.svg',
        socialDomain: 'https://instagram.com',
      },
      {
        id: 3,
        name: 'behance',
        iconPath: directoryPath + '/' + 'behance.svg',
        socialDomain: 'https://behance.net',
      },
      {
        id: 4,
        name: 'notion',
        iconPath: directoryPath + '/' + 'notion.svg',
        socialDomain: 'https://notion.so',
      },
      {
        id: 5,
        name: 'linkedin',
        iconPath: directoryPath + '/' + 'linkedin.svg',
        socialDomain: 'https://linkedin.com',
      },
      {
        id: 6,
        name: 'github',
        iconPath: directoryPath + '/' + 'github.svg',
        socialDomain: 'https://github.com',
      },
    ],
    skipDuplicates: true,
  });
};
