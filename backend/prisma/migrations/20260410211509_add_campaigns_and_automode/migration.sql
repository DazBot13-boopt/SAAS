-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'USER');

-- DropForeignKey
ALTER TABLE "TwitterAccount" DROP CONSTRAINT "TwitterAccount_groupId_fkey";

-- AlterTable
ALTER TABLE "TwitterAccount" ADD COLUMN     "autoMode" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "groupId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'USER',
ADD COLUMN     "subscriptionExpiresAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "Campaign" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CampaignContent" (
    "id" TEXT NOT NULL,
    "caption" TEXT,
    "mediaUrls" TEXT[],
    "linkUrl" TEXT,
    "usedCount" INTEGER NOT NULL DEFAULT 0,
    "campaignId" TEXT NOT NULL,

    CONSTRAINT "CampaignContent_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TwitterAccount" ADD CONSTRAINT "TwitterAccount_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "AccountGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Campaign" ADD CONSTRAINT "Campaign_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignContent" ADD CONSTRAINT "CampaignContent_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
