export type PrismaModel = 'user' | 'post' | 'article';

export type Target = {
  model: PrismaModel;
  field?: string;
};
