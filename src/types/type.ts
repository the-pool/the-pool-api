export type PrismaModel = 'user' | 'post' | 'member';

export type Target = {
  model?: PrismaModel;
  field?: string;
};
