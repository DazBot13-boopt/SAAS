-- AlterTable
ALTER TABLE "Campaign" ADD COLUMN     "groupId" TEXT;

-- AddForeignKey
ALTER TABLE "Campaign" ADD CONSTRAINT "Campaign_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "AccountGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;
