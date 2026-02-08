-- Change Product.category from enum to text without data loss
-- Drop default (enum), convert to text, set new default, enforce NOT NULL
ALTER TABLE "Product" ALTER COLUMN "category" DROP DEFAULT;
ALTER TABLE "Product" ALTER COLUMN "category" TYPE TEXT USING "category"::text;
UPDATE "Product" SET "category" = COALESCE("category", 'OTHER');
ALTER TABLE "Product" ALTER COLUMN "category" SET DEFAULT 'OTHER';
ALTER TABLE "Product" ALTER COLUMN "category" SET NOT NULL;

-- Drop the old enum type if exists and no longer used
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ProductCategory') THEN
    DROP TYPE "ProductCategory";
  END IF;
END$$;