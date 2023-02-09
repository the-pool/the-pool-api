/*
  Warnings:

  - You are about to drop the column `mainSkillId` on the `MemberSkill` table. All the data in the column will be lost.
  - You are about to drop the column `memberId` on the `MemberSkill` table. All the data in the column will be lost.
  - You are about to drop the `LessonBookMark` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MainSkill` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MemberReport` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name]` on the table `MemberSkill` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `categoryId` to the `Lesson` table without a default value. This is not possible if the table is not empty.
  - The required column `memberName` was added to the `Member` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `name` to the `MemberSkill` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "LessonBookMark" DROP CONSTRAINT "LessonBookMark_lessonId_fkey";

-- DropForeignKey
ALTER TABLE "LessonBookMark" DROP CONSTRAINT "LessonBookMark_memberId_fkey";

-- DropForeignKey
ALTER TABLE "MainSkill" DROP CONSTRAINT "MainSkill_majorId_fkey";

-- DropForeignKey
ALTER TABLE "MemberReport" DROP CONSTRAINT "MemberReport_memberId_fkey";

-- DropForeignKey
ALTER TABLE "MemberSkill" DROP CONSTRAINT "MemberSkill_mainSkillId_fkey";

-- DropForeignKey
ALTER TABLE "MemberSkill" DROP CONSTRAINT "MemberSkill_memberId_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_authorId_fkey";

-- AlterTable
ALTER TABLE "Lesson" ADD COLUMN     "categoryId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Member" ADD COLUMN     "job" VARCHAR(255),
ADD COLUMN     "memberName" VARCHAR(255) NOT NULL,
ALTER COLUMN "introduce" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "MemberSkill" DROP COLUMN "mainSkillId",
DROP COLUMN "memberId",
ADD COLUMN     "name" VARCHAR(50) NOT NULL;

-- DropTable
DROP TABLE "LessonBookMark";

-- DropTable
DROP TABLE "MainSkill";

-- DropTable
DROP TABLE "MemberReport";

-- DropTable
DROP TABLE "Post";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "MajorSkill" (
    "id" SERIAL NOT NULL,
    "majorId" INTEGER NOT NULL,
    "name" VARCHAR(30) NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MajorSkill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MemberMajorSkillMapping" (
    "id" SERIAL NOT NULL,
    "majorSkillId" INTEGER NOT NULL,
    "memberId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MemberMajorSkillMapping_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MemberSkillMapping" (
    "id" SERIAL NOT NULL,
    "memberId" INTEGER NOT NULL,
    "memberSkillId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MemberSkillMapping_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MemberInterest" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MemberInterest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MemberInterestMapping" (
    "id" SERIAL NOT NULL,
    "memberId" INTEGER NOT NULL,
    "memberInterestId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MemberInterestMapping_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MemberStatistics" (
    "memberId" INTEGER NOT NULL,
    "lessonCount" INTEGER NOT NULL DEFAULT 0,
    "feedbackCount" INTEGER NOT NULL DEFAULT 0,
    "commentCount" INTEGER NOT NULL DEFAULT 0,
    "followerCount" INTEGER NOT NULL DEFAULT 0,
    "followingCount" INTEGER NOT NULL DEFAULT 0,
    "rank" INTEGER,
    "point" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "MemberStatistics_pkey" PRIMARY KEY ("memberId")
);

-- CreateTable
CREATE TABLE "LessonBookmark" (
    "id" SERIAL NOT NULL,
    "memberId" INTEGER NOT NULL,
    "lessonId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LessonBookmark_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LessonLike" (
    "id" SERIAL NOT NULL,
    "memberId" INTEGER NOT NULL,
    "lessonId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LessonLike_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LessonCategory" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(30) NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LessonCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestionCategory" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(30) NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuestionCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" SERIAL NOT NULL,
    "memberId" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "hit" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(6),

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestionHashtag" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(20) NOT NULL,
    "questionId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuestionHashtag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestionLike" (
    "id" SERIAL NOT NULL,
    "memberId" INTEGER NOT NULL,
    "questionId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuestionLike_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestionAnswer" (
    "id" SERIAL NOT NULL,
    "memberId" INTEGER NOT NULL,
    "questionId" INTEGER NOT NULL,
    "answer" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(6),

    CONSTRAINT "QuestionAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestionAnswerLike" (
    "id" SERIAL NOT NULL,
    "memberId" INTEGER NOT NULL,
    "answerId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuestionAnswerLike_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestionAcceptAnswer" (
    "id" SERIAL NOT NULL,
    "questionId" INTEGER NOT NULL,
    "answerId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuestionAcceptAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MajorSkill_name_key" ON "MajorSkill"("name");

-- CreateIndex
CREATE UNIQUE INDEX "MemberInterest_name_key" ON "MemberInterest"("name");

-- CreateIndex
CREATE UNIQUE INDEX "MemberStatistics_memberId_key" ON "MemberStatistics"("memberId");

-- CreateIndex
CREATE UNIQUE INDEX "LessonCategory_name_key" ON "LessonCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "QuestionCategory_name_key" ON "QuestionCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "QuestionAcceptAnswer_answerId_key" ON "QuestionAcceptAnswer"("answerId");

-- CreateIndex
CREATE UNIQUE INDEX "MemberSkill_name_key" ON "MemberSkill"("name");

-- AddForeignKey
ALTER TABLE "MajorSkill" ADD CONSTRAINT "MajorSkill_majorId_fkey" FOREIGN KEY ("majorId") REFERENCES "Major"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "MemberMajorSkillMapping" ADD CONSTRAINT "MemberMajorSkillMapping_majorSkillId_fkey" FOREIGN KEY ("majorSkillId") REFERENCES "MajorSkill"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberMajorSkillMapping" ADD CONSTRAINT "MemberMajorSkillMapping_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberSkillMapping" ADD CONSTRAINT "MemberSkillMapping_memberSkillId_fkey" FOREIGN KEY ("memberSkillId") REFERENCES "MemberSkill"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberSkillMapping" ADD CONSTRAINT "MemberSkillMapping_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberInterestMapping" ADD CONSTRAINT "MemberInterestMapping_memberInterestId_fkey" FOREIGN KEY ("memberInterestId") REFERENCES "MemberInterest"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberInterestMapping" ADD CONSTRAINT "MemberInterestMapping_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberStatistics" ADD CONSTRAINT "MemberStatistics_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "LessonCategory"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonLevelEvaluation" ADD CONSTRAINT "LessonLevelEvaluation_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "LessonLevel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonBookmark" ADD CONSTRAINT "LessonBookmark_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonBookmark" ADD CONSTRAINT "LessonBookmark_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonLike" ADD CONSTRAINT "LessonLike_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonLike" ADD CONSTRAINT "LessonLike_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "QuestionCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionHashtag" ADD CONSTRAINT "QuestionHashtag_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionLike" ADD CONSTRAINT "QuestionLike_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionLike" ADD CONSTRAINT "QuestionLike_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionAnswer" ADD CONSTRAINT "QuestionAnswer_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionAnswer" ADD CONSTRAINT "QuestionAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionAnswerLike" ADD CONSTRAINT "QuestionAnswerLike_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionAnswerLike" ADD CONSTRAINT "QuestionAnswerLike_answerId_fkey" FOREIGN KEY ("answerId") REFERENCES "QuestionAnswer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionAcceptAnswer" ADD CONSTRAINT "QuestionAcceptAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionAcceptAnswer" ADD CONSTRAINT "QuestionAcceptAnswer_answerId_fkey" FOREIGN KEY ("answerId") REFERENCES "QuestionAnswer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
