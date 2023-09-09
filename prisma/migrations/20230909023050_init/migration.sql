/*
  Warnings:

  - Added the required column `amount` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subscriptionType` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Order` ADD COLUMN `amount` DOUBLE NOT NULL,
    ADD COLUMN `subscriptionType` VARCHAR(191) NOT NULL;
