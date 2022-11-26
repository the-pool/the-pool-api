/*
  Warnings:

  - You are about to drop the column `majorId` on the `MemberSkill` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[thumbnail]` on the table `Member` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `mainSkillId` to the `MemberSkill` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Member" DROP CONSTRAINT "Member_majorId_fkey";

-- DropForeignKey
ALTER TABLE "MemberSkill" DROP CONSTRAINT "MemberSkill_majorId_fkey";

-- DropForeignKey
ALTER TABLE "MemberSkill" DROP CONSTRAINT "MemberSkill_memberId_fkey";

-- AlterTable
ALTER TABLE "MainSkill" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Major" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Member" ADD COLUMN     "introduce" VARCHAR(255),
ADD COLUMN     "thumbnail" VARCHAR(255),
ALTER COLUMN "majorId" DROP NOT NULL,
ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "MemberSkill" DROP COLUMN "majorId",
ADD COLUMN     "mainSkillId" INTEGER NOT NULL,
ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "MemberReport" (
    "id" SERIAL NOT NULL,
    "memberId" INTEGER NOT NULL,
    "lessonCount" INTEGER NOT NULL DEFAULT 0,
    "feedbackCount" INTEGER NOT NULL DEFAULT 0,
    "communityCount" INTEGER NOT NULL DEFAULT 0,
    "rank" INTEGER,
    "point" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "MemberReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MemberFollow" (
    "id" SERIAL NOT NULL,
    "followerId" INTEGER NOT NULL,
    "followingId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MemberFollow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lesson" (
    "id" SERIAL NOT NULL,
    "memberId" INTEGER NOT NULL,
    "levelId" INTEGER NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "hit" INTEGER NOT NULL DEFAULT 0,
    "thumbnail" VARCHAR(255),
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(6),

    CONSTRAINT "Lesson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LessonLevelEvaluation" (
    "id" SERIAL NOT NULL,
    "memberId" INTEGER NOT NULL,
    "lessonId" INTEGER NOT NULL,
    "levelId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(6),

    CONSTRAINT "LessonLevelEvaluation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LessonSolution" (
    "id" SERIAL NOT NULL,
    "memberId" INTEGER NOT NULL,
    "lessonId" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(6),

    CONSTRAINT "LessonSolution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LessonBookMark" (
    "id" SERIAL NOT NULL,
    "memberId" INTEGER NOT NULL,
    "lessonId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LessonBookMark_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LessonLevel" (
    "id" SERIAL NOT NULL,
    "level" VARCHAR(10) NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LessonLevel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LessonHashtag" (
    "id" SERIAL NOT NULL,
    "tag" VARCHAR(10) NOT NULL,
    "lessonId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LessonHashtag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LessonComment" (
    "id" SERIAL NOT NULL,
    "memberId" INTEGER NOT NULL,
    "lessonId" INTEGER NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(6),

    CONSTRAINT "LessonComment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MemberReport_memberId_key" ON "MemberReport"("memberId");

-- CreateIndex
CREATE UNIQUE INDEX "Member_thumbnail_key" ON "Member"("thumbnail");

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_majorId_fkey" FOREIGN KEY ("majorId") REFERENCES "Major"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberReport" ADD CONSTRAINT "MemberReport_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberFollow" ADD CONSTRAINT "MemberFollow_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberFollow" ADD CONSTRAINT "MemberFollow_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "LessonLevel"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonLevelEvaluation" ADD CONSTRAINT "LessonLevelEvaluation_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonLevelEvaluation" ADD CONSTRAINT "LessonLevelEvaluation_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonSolution" ADD CONSTRAINT "LessonSolution_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonSolution" ADD CONSTRAINT "LessonSolution_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonBookMark" ADD CONSTRAINT "LessonBookMark_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonBookMark" ADD CONSTRAINT "LessonBookMark_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonHashtag" ADD CONSTRAINT "LessonHashtag_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonComment" ADD CONSTRAINT "LessonComment_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonComment" ADD CONSTRAINT "LessonComment_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberSkill" ADD CONSTRAINT "MemberSkill_mainSkillId_fkey" FOREIGN KEY ("mainSkillId") REFERENCES "MainSkill"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberSkill" ADD CONSTRAINT "MemberSkill_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;
