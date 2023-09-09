/*
  Warnings:

  - You are about to drop the column `alipay` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `avatarType` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `baidu` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `createdIp` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `dingTalk` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `displayName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `facebook` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `gitHub` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `google` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `owner` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `passwordType` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `qq` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `score` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `tag` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `weibo` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `User` DROP COLUMN `alipay`,
    DROP COLUMN `avatarType`,
    DROP COLUMN `baidu`,
    DROP COLUMN `createdIp`,
    DROP COLUMN `dingTalk`,
    DROP COLUMN `displayName`,
    DROP COLUMN `facebook`,
    DROP COLUMN `gitHub`,
    DROP COLUMN `google`,
    DROP COLUMN `owner`,
    DROP COLUMN `passwordType`,
    DROP COLUMN `qq`,
    DROP COLUMN `score`,
    DROP COLUMN `tag`,
    DROP COLUMN `type`,
    DROP COLUMN `updatedAt`,
    DROP COLUMN `weibo`;
