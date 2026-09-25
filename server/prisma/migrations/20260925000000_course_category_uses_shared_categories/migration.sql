ALTER TABLE "Course" DROP CONSTRAINT IF EXISTS "Course_categoryId_fkey";

UPDATE "Course" AS course
SET "categoryId" = category.id
FROM "CourseCategory" AS old_category, "Category" AS category
WHERE course."categoryId" = old_category.id
  AND LOWER(BTRIM(old_category.name)) = LOWER(BTRIM(category.name));

UPDATE "Course" AS course
SET "categoryId" = NULL
WHERE course."categoryId" IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM "Category" AS category WHERE category.id = course."categoryId"
  );

ALTER TABLE "Course"
ADD CONSTRAINT "Course_categoryId_fkey"
FOREIGN KEY ("categoryId") REFERENCES "Category"("id")
ON DELETE SET NULL ON UPDATE CASCADE;
