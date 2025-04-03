/*
  Warnings:

  - Added the required column `videoId` to the `Compromisso` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Compromisso" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "data" DATETIME NOT NULL,
    "tipo" TEXT NOT NULL,
    "videoId" INTEGER NOT NULL,
    CONSTRAINT "Compromisso_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Compromisso" ("data", "id", "nome", "tipo") SELECT "data", "id", "nome", "tipo" FROM "Compromisso";
DROP TABLE "Compromisso";
ALTER TABLE "new_Compromisso" RENAME TO "Compromisso";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
