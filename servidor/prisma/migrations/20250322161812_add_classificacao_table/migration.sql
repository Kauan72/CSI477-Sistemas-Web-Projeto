-- CreateTable
CREATE TABLE "Video" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "link" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ClassificacaoToVideo" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_ClassificacaoToVideo_A_fkey" FOREIGN KEY ("A") REFERENCES "Classificacao" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ClassificacaoToVideo_B_fkey" FOREIGN KEY ("B") REFERENCES "Video" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Classificacao" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tag" TEXT NOT NULL
);
INSERT INTO "new_Classificacao" ("id", "tag") SELECT "id", "tag" FROM "Classificacao";
DROP TABLE "Classificacao";
ALTER TABLE "new_Classificacao" RENAME TO "Classificacao";
CREATE UNIQUE INDEX "Classificacao_tag_key" ON "Classificacao"("tag");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "_ClassificacaoToVideo_AB_unique" ON "_ClassificacaoToVideo"("A", "B");

-- CreateIndex
CREATE INDEX "_ClassificacaoToVideo_B_index" ON "_ClassificacaoToVideo"("B");
