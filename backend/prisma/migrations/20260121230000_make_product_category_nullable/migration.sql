-- Make Product.category nullable and remove default to match Prisma schema
ALTER TABLE "Product" ALTER COLUMN "category" DROP DEFAULT;
ALTER TABLE "Product" ALTER COLUMN "category" DROP NOT NULL;