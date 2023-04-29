/*
  Warnings:

  - You are about to drop the column `lessonId` on the `LessonHashtag` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[lessonId,memberId]` on the table `LessonBookmark` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[lessonId,memberId]` on the table `LessonLike` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[followerId,followingId]` on the table `MemberFollow` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "LessonHashtag" DROP CONSTRAINT "LessonHashtag_lessonId_fkey";

-- AlterTable
ALTER TABLE "LessonHashtag" DROP COLUMN "lessonId",
ALTER COLUMN "tag" SET DATA TYPE VARCHAR(50);

-- AlterTable
ALTER TABLE "LessonSolution" ADD COLUMN     "relatedLink" TEXT;

-- AlterTable
ALTER TABLE "MemberStatistics" ADD COLUMN     "solutionCount" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "MemberSocialLink" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR NOT NULL,
    "iconPath" TEXT NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(6),

    CONSTRAINT "MemberSocialLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MemberSocialLinkMapping" (
    "id" SERIAL NOT NULL,
    "memberId" INTEGER NOT NULL,
    "memberSocialLinkId" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MemberSocialLinkMapping_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LessonHashtagMapping" (
    "id" SERIAL NOT NULL,
    "lessonId" INTEGER NOT NULL,
    "lessonHashtagId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LessonHashtagMapping_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LessonSolutionLike" (
    "id" SERIAL NOT NULL,
    "memberId" INTEGER NOT NULL,
    "lessonSolutionId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LessonSolutionLike_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LessonSolutionHashtag" (
    "id" SERIAL NOT NULL,
    "tag" VARCHAR(50) NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(6),

    CONSTRAINT "LessonSolutionHashtag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LessonSolutionHashtagMapping" (
    "id" SERIAL NOT NULL,
    "lessonSolutionId" INTEGER NOT NULL,
    "lessonSolutionHashtagId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LessonSolutionHashtagMapping_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LessonSolutionComment" (
    "id" SERIAL NOT NULL,
    "memberId" INTEGER NOT NULL,
    "lessonSolutionId" INTEGER NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(6),

    CONSTRAINT "LessonSolutionComment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MemberSocialLink_name_key" ON "MemberSocialLink"("name");

-- CreateIndex
CREATE UNIQUE INDEX "MemberSocialLink_iconPath_key" ON "MemberSocialLink"("iconPath");

-- CreateIndex
CREATE UNIQUE INDEX "LessonSolutionLike_lessonSolutionId_memberId_key" ON "LessonSolutionLike"("lessonSolutionId", "memberId");

-- CreateIndex
CREATE UNIQUE INDEX "LessonSolutionHashtag_tag_key" ON "LessonSolutionHashtag"("tag");

-- CreateIndex
CREATE UNIQUE INDEX "LessonBookmark_lessonId_memberId_key" ON "LessonBookmark"("lessonId", "memberId");

-- CreateIndex
CREATE UNIQUE INDEX "LessonLike_lessonId_memberId_key" ON "LessonLike"("lessonId", "memberId");

-- CreateIndex
CREATE UNIQUE INDEX "MemberFollow_followerId_followingId_key" ON "MemberFollow"("followerId", "followingId");

-- AddForeignKey
ALTER TABLE "MemberSocialLinkMapping" ADD CONSTRAINT "MemberSocialLinkMapping_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberSocialLinkMapping" ADD CONSTRAINT "MemberSocialLinkMapping_memberSocialLinkId_fkey" FOREIGN KEY ("memberSocialLinkId") REFERENCES "MemberSocialLink"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonHashtagMapping" ADD CONSTRAINT "LessonHashtagMapping_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonHashtagMapping" ADD CONSTRAINT "LessonHashtagMapping_lessonHashtagId_fkey" FOREIGN KEY ("lessonHashtagId") REFERENCES "LessonHashtag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonSolutionLike" ADD CONSTRAINT "LessonSolutionLike_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonSolutionLike" ADD CONSTRAINT "LessonSolutionLike_lessonSolutionId_fkey" FOREIGN KEY ("lessonSolutionId") REFERENCES "LessonSolution"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonSolutionHashtagMapping" ADD CONSTRAINT "LessonSolutionHashtagMapping_lessonSolutionId_fkey" FOREIGN KEY ("lessonSolutionId") REFERENCES "LessonSolution"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonSolutionHashtagMapping" ADD CONSTRAINT "LessonSolutionHashtagMapping_lessonSolutionHashtagId_fkey" FOREIGN KEY ("lessonSolutionHashtagId") REFERENCES "LessonSolutionHashtag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonSolutionComment" ADD CONSTRAINT "LessonSolutionComment_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonSolutionComment" ADD CONSTRAINT "LessonSolutionComment_lessonSolutionId_fkey" FOREIGN KEY ("lessonSolutionId") REFERENCES "LessonSolution"("id") ON DELETE CASCADE ON UPDATE CASCADE;
