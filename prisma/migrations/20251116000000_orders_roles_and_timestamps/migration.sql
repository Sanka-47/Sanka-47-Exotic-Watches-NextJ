-- CreateEnum
CREATE TABLE `orders` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` VARCHAR(191) NOT NULL,
    `status` ENUM('PENDING', 'PAID', 'FAILED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    `totalCents` INTEGER NOT NULL,
    `currency` VARCHAR(191) NOT NULL DEFAULT 'usd',
    `stripePaymentIntentId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `orders_stripePaymentIntentId_key`(`stripePaymentIntentId`),
    INDEX `orders_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `order_items` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `orderId` INTEGER NOT NULL,
    `productId` INTEGER NULL,
    `productName` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `unitPriceCents` INTEGER NOT NULL,

    INDEX `order_items_orderId_idx`(`orderId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AlterTable: users gets a role column
ALTER TABLE `users` ADD COLUMN `role` ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER';

-- AlterTable: products lose the unused status column, gain timestamps,
-- optional secondary images and text-sized image URLs
ALTER TABLE `Product`
    DROP COLUMN `status`,
    MODIFY `imageUrl_1` TEXT NOT NULL,
    MODIFY `imageUrl_2` TEXT NULL,
    MODIFY `imageUrl_3` TEXT NULL,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable: category is optional, unique name, indexes
ALTER TABLE `Product` DROP FOREIGN KEY `Product_categoryId_fkey`;
ALTER TABLE `Product` MODIFY `categoryId` INTEGER NULL;
ALTER TABLE `Product`
    ADD CONSTRAINT `Product_categoryId_fkey`
        FOREIGN KEY (`categoryId`) REFERENCES `Categories`(`id`)
        ON DELETE SET NULL ON UPDATE CASCADE;
CREATE UNIQUE INDEX `Categories_name_key` ON `Categories`(`name`);
CREATE INDEX `Product_categoryId_idx` ON `Product`(`categoryId`);
CREATE INDEX `Product_name_idx` ON `Product`(`name`);

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_userId_fkey`
    FOREIGN KEY (`userId`) REFERENCES `users`(`id`)
    ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_items` ADD CONSTRAINT `order_items_orderId_fkey`
    FOREIGN KEY (`orderId`) REFERENCES `orders`(`id`)
    ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_items` ADD CONSTRAINT `order_items_productId_fkey`
    FOREIGN KEY (`productId`) REFERENCES `Product`(`id`)
    ON DELETE SET NULL ON UPDATE CASCADE;
