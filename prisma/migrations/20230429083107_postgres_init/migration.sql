/*
  Warnings:

  - You are about to drop the column `commentCount` on the `MemberStatistics` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[socialDomain]` on the table `MemberSocialLink` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `socialDomain` to the `MemberSocialLink` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LessonComment" ALTER COLUMN "description" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "LessonSolutionComment" ALTER COLUMN "description" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "MemberSocialLink" ADD COLUMN     "socialDomain" VARCHAR NOT NULL;

-- AlterTable
ALTER TABLE "MemberStatistics" DROP COLUMN "commentCount",
ADD COLUMN     "lessonCommentCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "solutionCommentCount" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "MemberSocialLink_socialDomain_key" ON "MemberSocialLink"("socialDomain");
