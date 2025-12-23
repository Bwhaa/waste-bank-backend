/*
  Warnings:

  - You are about to drop the `Deposit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Member` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PointTransaction` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Reward` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RewardRedemption` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WasteType` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Deposit" DROP CONSTRAINT "Deposit_memberId_fkey";

-- DropForeignKey
ALTER TABLE "Deposit" DROP CONSTRAINT "Deposit_wasteTypeId_fkey";

-- DropForeignKey
ALTER TABLE "PointTransaction" DROP CONSTRAINT "PointTransaction_depositId_fkey";

-- DropForeignKey
ALTER TABLE "PointTransaction" DROP CONSTRAINT "PointTransaction_memberId_fkey";

-- DropForeignKey
ALTER TABLE "PointTransaction" DROP CONSTRAINT "PointTransaction_redemptionId_fkey";

-- DropForeignKey
ALTER TABLE "RewardRedemption" DROP CONSTRAINT "RewardRedemption_memberId_fkey";

-- DropForeignKey
ALTER TABLE "RewardRedemption" DROP CONSTRAINT "RewardRedemption_rewardId_fkey";

-- DropTable
DROP TABLE "Deposit";

-- DropTable
DROP TABLE "Member";

-- DropTable
DROP TABLE "PointTransaction";

-- DropTable
DROP TABLE "Reward";

-- DropTable
DROP TABLE "RewardRedemption";

-- DropTable
DROP TABLE "WasteType";

-- CreateTable
CREATE TABLE "members" (
    "id" TEXT NOT NULL,
    "line_id" TEXT,
    "email" TEXT,
    "password" TEXT,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "phone_number" TEXT,
    "qr_code" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'MEMBER',
    "status" "MemberStatus" NOT NULL DEFAULT 'ACTIVE',
    "current_points" INTEGER NOT NULL DEFAULT 0,
    "version" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "member_id" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_revoked" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "waste_types" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "category" "WasteCategory" NOT NULL DEFAULT 'GENERAL',
    "point_rate" DECIMAL(10,2) NOT NULL,
    "market_price" DECIMAL(10,2),
    "unit" "MeasureUnit" NOT NULL DEFAULT 'KG',
    "min_amount" DECIMAL(10,2) NOT NULL DEFAULT 0.1,
    "description" TEXT,
    "image_url" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "waste_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deposits" (
    "id" TEXT NOT NULL,
    "member_id" TEXT NOT NULL,
    "waste_type_id" INTEGER NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "point_earned" INTEGER NOT NULL,
    "status" "DepositStatus" NOT NULL DEFAULT 'PENDING',
    "note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "deposits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "point_transactions" (
    "id" TEXT NOT NULL,
    "member_id" TEXT NOT NULL,
    "type" "PointTransactionType" NOT NULL,
    "amount" INTEGER NOT NULL,
    "balance_after" INTEGER,
    "detail" TEXT,
    "deposit_id" TEXT,
    "redemption_id" TEXT,
    "is_expired_processed" BOOLEAN NOT NULL DEFAULT false,
    "expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT,

    CONSTRAINT "point_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rewards" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "image_url" TEXT,
    "cost_point" INTEGER NOT NULL,
    "stock" INTEGER NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rewards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reward_redemptions" (
    "id" TEXT NOT NULL,
    "member_id" TEXT NOT NULL,
    "reward_id" INTEGER NOT NULL,
    "point_used" INTEGER NOT NULL,
    "status" "RedemptionStatus" NOT NULL DEFAULT 'REQUESTED',
    "processed_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reward_redemptions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "members_line_id_key" ON "members"("line_id");

-- CreateIndex
CREATE UNIQUE INDEX "members_email_key" ON "members"("email");

-- CreateIndex
CREATE UNIQUE INDEX "members_qr_code_key" ON "members"("qr_code");

-- CreateIndex
CREATE INDEX "members_role_idx" ON "members"("role");

-- CreateIndex
CREATE INDEX "members_status_idx" ON "members"("status");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_token_key" ON "refresh_tokens"("token");

-- CreateIndex
CREATE INDEX "refresh_tokens_member_id_idx" ON "refresh_tokens"("member_id");

-- CreateIndex
CREATE UNIQUE INDEX "waste_types_name_key" ON "waste_types"("name");

-- CreateIndex
CREATE INDEX "deposits_member_id_created_at_idx" ON "deposits"("member_id", "created_at");

-- CreateIndex
CREATE INDEX "deposits_status_idx" ON "deposits"("status");

-- CreateIndex
CREATE UNIQUE INDEX "point_transactions_deposit_id_key" ON "point_transactions"("deposit_id");

-- CreateIndex
CREATE UNIQUE INDEX "point_transactions_redemption_id_key" ON "point_transactions"("redemption_id");

-- CreateIndex
CREATE INDEX "point_transactions_member_id_type_idx" ON "point_transactions"("member_id", "type");

-- CreateIndex
CREATE INDEX "point_transactions_member_id_expires_at_idx" ON "point_transactions"("member_id", "expires_at");

-- CreateIndex
CREATE INDEX "point_transactions_created_at_idx" ON "point_transactions"("created_at");

-- CreateIndex
CREATE INDEX "reward_redemptions_member_id_created_at_idx" ON "reward_redemptions"("member_id", "created_at");

-- CreateIndex
CREATE INDEX "reward_redemptions_status_idx" ON "reward_redemptions"("status");

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deposits" ADD CONSTRAINT "deposits_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deposits" ADD CONSTRAINT "deposits_waste_type_id_fkey" FOREIGN KEY ("waste_type_id") REFERENCES "waste_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "point_transactions" ADD CONSTRAINT "point_transactions_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "point_transactions" ADD CONSTRAINT "point_transactions_deposit_id_fkey" FOREIGN KEY ("deposit_id") REFERENCES "deposits"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "point_transactions" ADD CONSTRAINT "point_transactions_redemption_id_fkey" FOREIGN KEY ("redemption_id") REFERENCES "reward_redemptions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reward_redemptions" ADD CONSTRAINT "reward_redemptions_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reward_redemptions" ADD CONSTRAINT "reward_redemptions_reward_id_fkey" FOREIGN KEY ("reward_id") REFERENCES "rewards"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
