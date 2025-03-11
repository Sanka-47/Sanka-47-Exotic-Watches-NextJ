/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `product` table. All the data in the column will be lost.
  - Added the required column `imageUrl_1` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imageUrl_2` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imageUrl_3` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `product` DROP COLUMN `imageUrl`,
    ADD COLUMN `imageUrl_1` VARCHAR(191) NOT NULL,
    ADD COLUMN `imageUrl_2` VARCHAR(191) NOT NULL,
    ADD COLUMN `imageUrl_3` VARCHAR(191) NOT NULL;
