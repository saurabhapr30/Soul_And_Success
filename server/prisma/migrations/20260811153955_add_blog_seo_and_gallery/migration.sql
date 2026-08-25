-- AlterTable
ALTER TABLE "BlogPost" ADD COLUMN     "canonicalUrl" TEXT,
ADD COLUMN     "galleryImages" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "seoKeywords" TEXT[] DEFAULT ARRAY[]::TEXT[];
