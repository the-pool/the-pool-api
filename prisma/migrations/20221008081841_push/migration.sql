/*
  Warnings:

  - You are about to drop the `Article` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "description" TEXT;

-- DropTable
DROP TABLE "Article";
