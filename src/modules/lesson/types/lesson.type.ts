export type LessonLevelType = 'top' | 'middle' | 'bottom';

export type LessonLevelEvaluationType = {
  [key in LessonLevelType]: number;
};
