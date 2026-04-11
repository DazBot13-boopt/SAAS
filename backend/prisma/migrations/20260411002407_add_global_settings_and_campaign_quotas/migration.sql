-- AlterTable
ALTER TABLE "Campaign" ADD COLUMN     "commentsPerPost" INTEGER NOT NULL DEFAULT 5,
ADD COLUMN     "postsPerAccount" INTEGER NOT NULL DEFAULT 3,
ADD COLUMN     "targetCommunities" TEXT[],
ADD COLUMN     "totalCommentsQuota" INTEGER NOT NULL DEFAULT 50;

-- CreateTable
CREATE TABLE "GlobalSettings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "postsPerDayLimit" INTEGER NOT NULL DEFAULT 3,
    "commentsPerPostLimit" INTEGER NOT NULL DEFAULT 5,
    "followPerDayLimit" INTEGER NOT NULL DEFAULT 20,
    "autoSyncMetadata" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GlobalSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GlobalSettings_userId_key" ON "GlobalSettings"("userId");

-- AddForeignKey
ALTER TABLE "GlobalSettings" ADD CONSTRAINT "GlobalSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
