export enum ModelName {
  User = 'user',
  Post = 'post',
  Lesson = 'lesson',
  LessonHashtag = 'lessonHashtag',
  LessonHashtagMapping = 'lessonHashtagMapping',
  LessonLevelEvaluation = 'lessonLevelEvaluation',
  LessonSolution = 'lessonSolution',
  LessonCategory = 'lessonCategory',
  LessonBookmark = 'lessonBookmark',
  LessonComment = 'lessonComment',
  Member = 'member',
  MemberStatistics = 'memberStatistics',
  MemberSkill = 'memberSkill',
  MemberInterest = 'memberInterest',
  MajorSkill = 'majorSkill',
}

export enum OrderBy {
  Desc = 'desc',
  Asc = 'asc',
}

export enum BooleanString {
  True = 'true',
  False = 'false',
}

export enum MajorId {
  Development = 1,
  Design = 2,
}

export enum MajorText {
  Development = '개발',
  Design = '디자인',
}

export enum MajorSkillId {
  Backend = 1,
  WebFrontend = 2,
  Ios = 3,
  Android = 4,
  EtcDev = 5,
  WebDesign = 6,
  UiUx = 7,
  Bx = 8,
  EtcDesign = 9,
}

export enum LessonLevelId {
  // 상
  Top = 1,
  // 중
  Middle = 2,
  // 하
  Bottom = 3,
}

export enum LessonCategoryId {
  Backend = 1,
  WebFrontend = 2,
  Ios = 3,
  Android = 4,
  EtcDev = 5,
  WebDesign = 6,
  UiUx = 7,
  Bx = 8,
  EtcDesign = 9,
}

export enum EntityDate {
  CreatedAt = 'createdAt',
  UpdatedAt = 'updatedAt',
  DeletedAt = 'deletedAt',
}

export enum EntityId {
  Id = 'id',
}

export enum DomainName {
  Lesson = 'lessons',
}
