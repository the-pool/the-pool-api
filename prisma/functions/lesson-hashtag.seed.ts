import { createDataForSeed } from '../seed';

export const lessonHashtagSeed = async (prisma) => {
  enum DevelopHashtag {
    Backend = '백엔드개발',
    WebFrontend = '웹 프론트엔드',
    iOS = 'iOS',
    Android = '안드로이드',
    Etc = '기타 개발',
    Javascript = 'Javascript',
    React = 'React',
    Vue = 'Vue',
    Angular = 'Angular',
    NodeJS = 'NodeJS',
    Java = 'Java',
    Python = 'Python',
    PHP = 'PHP',
    InfraStructure = 'InfraStructure',
    Database = 'Database',
    Git = 'Git',
    BigData = '빅데이터',
    AI = 'AI',
    MachineLearning = 'MachineLearning',
    C = 'C',
    TypeScript = 'Typescript',
  }

  enum AlgorithmHashtag {
    Greedy = '그리디',
    Implementation = '구현',
    DFS = 'DFS',
    BFS = 'BFS',
    Sorting = '정렬',
    BinarySearch = '이진 탐색',
    DynamicProgramming = '다이나믹 프로그래밍',
    ShortestPath = '최단 경로',
    GraphTheory = '그래프 이론',
  }

  const developHashtags = createDataForSeed(DevelopHashtag, 'string', 'tag');
  const algorithmHashtags = createDataForSeed(
    AlgorithmHashtag,
    'string',
    'tag',
  );

  await prisma.lessonHashtag.createMany({
    data: [...developHashtags, ...algorithmHashtags],
    skipDuplicates: true,
  });
};
