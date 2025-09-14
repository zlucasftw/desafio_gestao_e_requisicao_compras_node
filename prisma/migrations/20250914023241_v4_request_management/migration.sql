-- DropForeignKey
ALTER TABLE `PurchaseRequests` DROP FOREIGN KEY `PurchaseRequests_userId_fkey`;

-- DropForeignKey
ALTER TABLE `RequestItems` DROP FOREIGN KEY `RequestItems_purchaseRequestId_fkey`;

-- DropIndex
DROP INDEX `PurchaseRequests_userId_fkey` ON `PurchaseRequests`;

-- DropIndex
DROP INDEX `RequestItems_purchaseRequestId_fkey` ON `RequestItems`;

-- AlterTable
ALTER TABLE `ApprovalHistory` MODIFY `oldStatus` ENUM('DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'SUBMITTED';

-- AddForeignKey
ALTER TABLE `PurchaseRequests` ADD CONSTRAINT `PurchaseRequests_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RequestItems` ADD CONSTRAINT `RequestItems_purchaseRequestId_fkey` FOREIGN KEY (`purchaseRequestId`) REFERENCES `PurchaseRequests`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
