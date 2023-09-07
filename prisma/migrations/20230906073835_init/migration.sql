/*
  Warnings:

  - A unique constraint covering the columns `[owner]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `User` ADD COLUMN `alipay` VARCHAR(100) NULL,
    ADD COLUMN `avatar` VARCHAR(500) NULL,
    ADD COLUMN `avatarType` VARCHAR(100) NULL,
    ADD COLUMN `baidu` VARCHAR(100) NULL,
    ADD COLUMN `createdIp` VARCHAR(100) NULL,
    ADD COLUMN `dingTalk` VARCHAR(100) NULL,
    ADD COLUMN `displayName` VARCHAR(100) NULL,
    ADD COLUMN `email` VARCHAR(100) NULL,
    ADD COLUMN `facebook` VARCHAR(100) NULL,
    ADD COLUMN `gitHub` VARCHAR(100) NULL,
    ADD COLUMN `google` VARCHAR(100) NULL,
    ADD COLUMN `owner` VARCHAR(100) NOT NULL DEFAULT '',
    ADD COLUMN `passwordType` VARCHAR(100) NULL,
    ADD COLUMN `phone` VARCHAR(20) NULL,
    ADD COLUMN `qq` VARCHAR(100) NULL,
    ADD COLUMN `score` INTEGER NULL DEFAULT 0,
    ADD COLUMN `tag` VARCHAR(100) NULL,
    ADD COLUMN `type` VARCHAR(100) NULL,
    ADD COLUMN `weChat` VARCHAR(100) NULL,
    ADD COLUMN `weibo` VARCHAR(100) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_owner_key` ON `User`(`owner`);

-- CreateIndex
CREATE UNIQUE INDEX `User_email_key` ON `User`(`email`);
