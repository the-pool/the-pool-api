export type PrismaModel = 'user' | 'post';

export type Target = {
  model?: PrismaModel;
  field?: string;
};
