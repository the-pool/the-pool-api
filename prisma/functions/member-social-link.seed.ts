import { PrismaClient } from '@prisma/client';
import path from 'path';

export const memberSocialLinkSeed = async (prisma: PrismaClient) => {
  const directoryPath = 'uploads/member-sns-icon';

  // Member Social Link Seed
  await prisma.memberSocialLink.createMany({
    data: [
      {
        id: 1,
        name: 'etc',
        iconPath: path.join(directoryPath, 'etc.svg'),
      },
      {
        id: 2,
        name: 'instagram',
        iconPath: path.join(directoryPath, 'instagram.svg'),
      },
      {
        id: 3,
        name: 'behance',
        iconPath: path.join(directoryPath, 'behance.svg'),
      },
      {
        id: 4,
        name: 'notion',
        iconPath: path.join(directoryPath, 'notion.svg'),
      },
      {
        id: 5,
        name: 'linkedin',
        iconPath: path.join(directoryPath, 'linkedin.svg'),
      },
      {
        id: 6,
        name: 'github',
        iconPath: path.join(directoryPath, 'github.svg'),
      },
    ],
    skipDuplicates: true,
  });
};
