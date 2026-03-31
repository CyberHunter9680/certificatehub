DO $$ BEGIN
    CREATE TYPE "AdPlacement" AS ENUM ('HEADER', 'SIDEBAR', 'BETWEEN_CERTIFICATES', 'FOOTER');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Blog" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "featuredImage" TEXT,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Blog_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Ad" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "adCode" TEXT NOT NULL,
    "placement" "AdPlacement" NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Ad_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "Certificate" ADD COLUMN "categoryId" TEXT;

CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");
CREATE UNIQUE INDEX "Blog_slug_key" ON "Blog"("slug");

ALTER TABLE "Certificate"
ADD CONSTRAINT "Certificate_categoryId_fkey"
FOREIGN KEY ("categoryId") REFERENCES "Category"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

WITH raw_categories AS (
    SELECT DISTINCT BTRIM("category") AS name
    FROM "Certificate"
    WHERE "category" IS NOT NULL AND BTRIM("category") <> ''
),
slug_candidates AS (
    SELECT
        name,
        LOWER(TRIM(BOTH '-' FROM REGEXP_REPLACE(name, '[^a-zA-Z0-9]+', '-', 'g'))) AS base_slug
    FROM raw_categories
),
ranked_categories AS (
    SELECT
        name,
        base_slug,
        ROW_NUMBER() OVER (PARTITION BY base_slug ORDER BY name) AS slug_rank
    FROM slug_candidates
),
inserted_categories AS (
    INSERT INTO "Category" ("id", "name", "slug", "createdAt", "updatedAt")
    SELECT
        CONCAT('cat_', SUBSTRING(MD5(name) FROM 1 FOR 24)),
        name,
        CASE
            WHEN base_slug = '' THEN CONCAT('category-', slug_rank)
            WHEN slug_rank = 1 THEN base_slug
            ELSE CONCAT(base_slug, '-', slug_rank)
        END,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    FROM ranked_categories
    ON CONFLICT ("name") DO NOTHING
    RETURNING "id", "name"
)
UPDATE "Certificate" AS certificate
SET "categoryId" = category_lookup."id"
FROM (
    SELECT "id", "name" FROM inserted_categories
    UNION
    SELECT "id", "name" FROM "Category"
) AS category_lookup
WHERE BTRIM(certificate."category") = category_lookup."name";
