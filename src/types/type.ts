export type PrismaModel = 'user' | 'post' | 'member' | 'lesson';

export type Target = {
  model?: PrismaModel;
  field?: string;
};
