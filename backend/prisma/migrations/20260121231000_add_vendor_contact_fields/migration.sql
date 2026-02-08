-- Add new columns to Vendor: category, contactName, contactNumber, contactEmail
ALTER TABLE "Vendor" ADD COLUMN IF NOT EXISTS "category" TEXT;
ALTER TABLE "Vendor" ADD COLUMN IF NOT EXISTS "contactName" TEXT;
ALTER TABLE "Vendor" ADD COLUMN IF NOT EXISTS "contactNumber" TEXT;
ALTER TABLE "Vendor" ADD COLUMN IF NOT EXISTS "contactEmail" TEXT;