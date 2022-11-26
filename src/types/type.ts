export type PrismaModel = 'user' | 'post' | 'member' | 'lesson';

export type Target = {
  model?: PrismaModel;
  field?: string;
};

export type MajorText = '개발' | '디자인';
