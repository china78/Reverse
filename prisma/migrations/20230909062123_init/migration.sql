/*
  Warnings:

  - Added the required column `success_time` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transaction_id` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Order` ADD COLUMN `success_time` VARCHAR(191) NOT NULL,
    ADD COLUMN `transaction_id` VARCHAR(191) NOT NULL;
