/*
  Warnings:

  - Added the required column `playerLastEdits` to the `Grid` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Grid" ADD COLUMN     "playerLastEdits" JSONB NOT NULL DEFAULT '{}';
