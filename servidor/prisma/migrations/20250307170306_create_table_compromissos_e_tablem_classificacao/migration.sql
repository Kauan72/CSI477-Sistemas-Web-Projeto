-- CreateTable
CREATE TABLE "Compromisso" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "data" DATETIME NOT NULL,
    "tipo" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Classificacao" (
    "id" INTEGER NOT NULL,
    "tag" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Classificacao_id_key" ON "Classificacao"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Classificacao_tag_key" ON "Classificacao"("tag");
