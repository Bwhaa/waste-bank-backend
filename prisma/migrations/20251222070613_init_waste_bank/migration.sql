-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('MEMBER', 'STAFF', 'ADMIN', 'SUPER_ADMIN', 'AUDITOR');

-- CreateEnum
CREATE TYPE "MemberStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED', 'BANNED');

-- CreateEnum
CREATE TYPE "PointTransactionType" AS ENUM ('EARN_DEPOSIT', 'EARN_CAMPAIGN', 'ADJUSTMENT_ADD', 'REFUND_REDEMPTION', 'SPEND_REDEMPTION', 'POINT_EXPIRED', 'ADJUSTMENT_DEDUCT');

-- CreateEnum
CREATE TYPE "RedemptionStatus" AS ENUM ('REQUESTED', 'PREPARING', 'COMPLETED', 'CANCELLED', 'REJECTED', 'FAILED');

-- CreateEnum
CREATE TYPE "DepositStatus" AS ENUM ('PENDING', 'COMPLETED', 'CANCELLED', 'DISPUTED');

-- CreateEnum
CREATE TYPE "WasteCategory" AS ENUM ('PLASTIC', 'GLASS', 'PAPER', 'METAL', 'ORGANIC', 'HAZARDOUS', 'GENERAL');

-- CreateEnum
CREATE TYPE "MeasureUnit" AS ENUM ('KG', 'GRAM', 'PIECE', 'LITER');

-- CreateTable
CREATE TABLE "Member" (
    "id" TEXT NOT NULL,
    "lineId" TEXT,
    "name" TEXT NOT NULL,
    "qrCode" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'MEMBER',
    "status" "MemberStatus" NOT NULL DEFAULT 'ACTIVE',
    "currentPoints" INTEGER NOT NULL DEFAULT 0,
    "version" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WasteType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "category" "WasteCategory" NOT NULL,
    "pointRate" DECIMAL(10,2) NOT NULL,
    "marketPrice" DECIMAL(10,2),
    "unit" "MeasureUnit" NOT NULL DEFAULT 'KG',
    "minAmount" DECIMAL(10,2) NOT NULL DEFAULT 0.1,
    "description" TEXT,
    "imageUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WasteType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Deposit" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "wasteTypeId" INTEGER NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "pointEarned" INTEGER NOT NULL,
    "status" "DepositStatus" NOT NULL DEFAULT 'PENDING',
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Deposit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PointTransaction" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "type" "PointTransactionType" NOT NULL,
    "amount" INTEGER NOT NULL,
    "balanceAfter" INTEGER,
    "detail" TEXT,
    "depositId" TEXT,
    "redemptionId" TEXT,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,

    CONSTRAINT "PointTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reward" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "costPoint" INTEGER NOT NULL,
    "stock" INTEGER NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reward_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RewardRedemption" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "rewardId" INTEGER NOT NULL,
    "pointUsed" INTEGER NOT NULL,
    "status" "RedemptionStatus" NOT NULL DEFAULT 'REQUESTED',
    "processedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RewardRedemption_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Member_lineId_key" ON "Member"("lineId");

-- CreateIndex
CREATE UNIQUE INDEX "Member_qrCode_key" ON "Member"("qrCode");

-- CreateIndex
CREATE INDEX "Member_role_idx" ON "Member"("role");

-- CreateIndex
CREATE INDEX "Member_status_idx" ON "Member"("status");

-- CreateIndex
CREATE INDEX "Member_deletedAt_idx" ON "Member"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "WasteType_name_key" ON "WasteType"("name");

-- CreateIndex
CREATE INDEX "Deposit_memberId_createdAt_idx" ON "Deposit"("memberId", "createdAt");

-- CreateIndex
CREATE INDEX "Deposit_status_idx" ON "Deposit"("status");

-- CreateIndex
CREATE UNIQUE INDEX "PointTransaction_depositId_key" ON "PointTransaction"("depositId");

-- CreateIndex
CREATE UNIQUE INDEX "PointTransaction_redemptionId_key" ON "PointTransaction"("redemptionId");

-- CreateIndex
CREATE INDEX "PointTransaction_memberId_type_idx" ON "PointTransaction"("memberId", "type");

-- CreateIndex
CREATE INDEX "PointTransaction_memberId_expiresAt_idx" ON "PointTransaction"("memberId", "expiresAt");

-- CreateIndex
CREATE INDEX "PointTransaction_createdAt_idx" ON "PointTransaction"("createdAt");

-- CreateIndex
CREATE INDEX "RewardRedemption_memberId_createdAt_idx" ON "RewardRedemption"("memberId", "createdAt");

-- CreateIndex
CREATE INDEX "RewardRedemption_status_idx" ON "RewardRedemption"("status");

-- AddForeignKey
ALTER TABLE "Deposit" ADD CONSTRAINT "Deposit_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deposit" ADD CONSTRAINT "Deposit_wasteTypeId_fkey" FOREIGN KEY ("wasteTypeId") REFERENCES "WasteType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PointTransaction" ADD CONSTRAINT "PointTransaction_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PointTransaction" ADD CONSTRAINT "PointTransaction_depositId_fkey" FOREIGN KEY ("depositId") REFERENCES "Deposit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PointTransaction" ADD CONSTRAINT "PointTransaction_redemptionId_fkey" FOREIGN KEY ("redemptionId") REFERENCES "RewardRedemption"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RewardRedemption" ADD CONSTRAINT "RewardRedemption_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RewardRedemption" ADD CONSTRAINT "RewardRedemption_rewardId_fkey" FOREIGN KEY ("rewardId") REFERENCES "Reward"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
