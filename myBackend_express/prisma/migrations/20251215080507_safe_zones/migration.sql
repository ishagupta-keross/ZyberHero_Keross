-- CreateTable
CREATE TABLE "safe_zones" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "childId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "latitude" REAL NOT NULL,
    "longitude" REAL NOT NULL,
    "radius" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "safe_zones_childId_fkey" FOREIGN KEY ("childId") REFERENCES "children" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "safe_zones_childId_idx" ON "safe_zones"("childId");
