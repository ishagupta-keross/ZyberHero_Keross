/*
  Warnings:

  - You are about to drop the column `externalId` on the `children` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `children` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[macAddress]` on the table `devices` will be added. If there are existing duplicate values, this will fail.
  - Made the column `name` on table `children` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_children" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "age" INTEGER,
    "gender" TEXT,
    "dob" DATETIME,
    "phone" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_children" ("createdAt", "id", "name") SELECT "createdAt", "id", "name" FROM "children";
DROP TABLE "children";
ALTER TABLE "new_children" RENAME TO "children";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "devices_macAddress_key" ON "devices"("macAddress");
