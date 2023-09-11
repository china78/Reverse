/*
  Warnings:

  - You are about to drop the column `uuid` on the `Order` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[orderNumber]` on the table `Order` will be added. If there are existing duplicate values, this will fail.
  - The required column `orderNumber` was added to the `Order` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropIndex
DROP INDEX `Order_uuid_key` ON `Order`;

-- AlterTable
ALTER TABLE `Order` DROP COLUMN `uuid`,
    ADD COLUMN `orderNumber` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Order_orderNumber_key` ON `Order`(`orderNumber`);
