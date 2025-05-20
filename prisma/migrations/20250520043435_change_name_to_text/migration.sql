-- DropIndex
DROP INDEX `Product_name_idx` ON `product`;

-- AlterTable
ALTER TABLE `product` MODIFY `name` TEXT NOT NULL,
    MODIFY `description` LONGTEXT NULL;
