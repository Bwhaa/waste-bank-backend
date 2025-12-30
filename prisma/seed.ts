import {
  PrismaClient,
  UserRole,
  DepositStatus,
  PointTransactionType,
  MemberStatus,
  RedemptionStatus, // เพิ่ม Enum นี้
} from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Start seeding data...');

  // 1. ล้างข้อมูลเก่า (เรียงตามลำดับ FK เพื่อไม่ให้ Error)
  await prisma.pointTransaction.deleteMany();
  await prisma.rewardRedemption.deleteMany();
  await prisma.deposit.deleteMany();
  await prisma.reward.deleteMany();
  await prisma.member.deleteMany();
  await prisma.wasteType.deleteMany();

  console.log('🧹 Cleaned up old data');

  // 2. สร้างประเภทขยะ (Master Data)
  const plastic = await prisma.wasteType.create({
    data: {
      name: 'ขวดพลาสติกใส (PET)',
      pointRate: 10.0,
      marketPrice: 5.0,
      unit: 'KG',
      imageUrl:
        'https://images.unsplash.com/photo-1595278069441-2cf29f525a3c?auto=format&fit=crop&q=80&w=300',
      description: 'ขวดน้ำดื่มใส ล้างสะอาด',
      isActive: true, // ✅ เน้นย้ำว่าเปิดใช้งาน
    },
  });

  const can = await prisma.wasteType.create({
    data: {
      name: 'กระป๋องอลูมิเนียม',
      pointRate: 20.0,
      marketPrice: 30.0,
      unit: 'KG',
      imageUrl:
        'https://images.unsplash.com/photo-1537084642907-629340c7e59c?auto=format&fit=crop&q=80&w=300',
      description: 'กระป๋องน้ำอัดลม บีบแบน',
      isActive: true,
    },
  });

  const glass = await prisma.wasteType.create({
    data: {
      name: 'ขวดแก้ว',
      pointRate: 5.0,
      marketPrice: 2.0,
      unit: 'KG',
      imageUrl:
        'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&q=80&w=300',
      isActive: true,
    },
  });

  const paper = await prisma.wasteType.create({
    data: {
      name: 'กระดาษลัง',
      pointRate: 2.0,
      marketPrice: 1.5,
      unit: 'KG',
      imageUrl:
        'https://images.unsplash.com/photo-1603484477846-c6785e8a4521?auto=format&fit=crop&q=80&w=300',
      isActive: true,
    },
  });

  console.log('✅ Waste Types created');

  // 3. สร้าง User
  const hashedPassword = await bcrypt.hash('123456', 10);

  // 3.1 Admin
  const admin = await prisma.member.create({
    data: {
      email: 'admin@demo.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'System',
      role: UserRole.ADMIN,
      phoneNumber: '0999999999',
      address: 'สำนักงานเทศบาล (ห้อง Server) ชั้น 2',
      isActive: true,
    },
  });
  // 3.1.5 สร้าง Staff (เพิ่มใหม่)
  const staff = await prisma.member.create({
    data: {
      email: 'staff@demo.com',
      password: hashedPassword,
      firstName: 'Staff',
      lastName: 'Service',
      role: UserRole.STAFF, // 👈 ระบุ Role เป็น Staff
      phoneNumber: '0888888888',
      address: 'จุดรับซื้อขยะ อาคาร A',
      isActive: true,
    },
  });
  console.log('✅ Staff created');

  // 3.2 Members (สร้าง 10 คน)
  const members = [];
  for (let i = 1; i <= 10; i++) {
    const member = await prisma.member.create({
      data: {
        email: `user${i}@demo.com`,
        password: hashedPassword,
        firstName: `Member`,
        lastName: `${i}`,
        role: UserRole.MEMBER,
        phoneNumber: `080000000${i - 1}`,
        currentPoints: 0,
        address: `บ้านเลขที่ 99/${i} หมู่ ${i} ต.บางบัวทอง อ.บางบัวทอง จ.นนทบุรี 11110`,
        isActive: true,
      },
    });
    members.push(member);
  }
  console.log('✅ Users created (Password: 123456)');

  // 4. สร้างของรางวัล (Rewards)
  // เก็บรางวัลใส่ตัวแปรไว้ จะได้เอาไปสุ่มแลกได้
  const rewardsData = [
    {
      name: 'ส่วนลดค่าไฟ 50 บาท',
      description: 'ใช้เป็นส่วนลดบิลค่าไฟเดือนถัดไป',
      costPoint: 500,
      stock: 100,
      imageUrl: 'https://images.unsplash.com/photo-1550565118-3a1400d786e9',
    },
    {
      name: 'ถุงผ้าลดโลกร้อน',
      description: 'ลาย Limited Edition',
      costPoint: 200,
      stock: 50,
      imageUrl: 'https://images.unsplash.com/photo-1597484661643-2f5fef640dd1',
    },
    {
      name: 'แก้วเก็บความเย็น',
      description: 'เก็บความเย็นได้ 24 ชม.',
      costPoint: 1000,
      stock: 20,
      imageUrl: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952',
    },
    {
      name: 'คูปองกาแฟ',
      description: 'Starbucks 100.-',
      costPoint: 800,
      stock: 0, // ของหมด
      imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93',
    },
  ];

  const rewards = [];
  for (const r of rewardsData) {
    const reward = await prisma.reward.create({
      data: { ...r, isActive: true },
    });
    rewards.push(reward);
  }
  console.log('✅ Rewards created');

  // 5. จำลอง Transaction (ฝาก + แลก)
  const wasteTypesList = [plastic, can, glass, paper];

  for (const member of members) {
    // 5.1 จำลองการฝาก (Deposit)
    const txCount = Math.floor(Math.random() * 5) + 3; // 3-7 ครั้ง

    for (let j = 0; j < txCount; j++) {
      const selectedWaste =
        wasteTypesList[Math.floor(Math.random() * wasteTypesList.length)];
      const weight = Math.floor(Math.random() * 10) + 1;
      const points = Math.floor(weight * Number(selectedWaste.pointRate));

      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - Math.floor(Math.random() * 30)); // ย้อนหลัง 30 วัน

      const deposit = await prisma.deposit.create({
        data: {
          memberId: member.id,
          wasteTypeId: selectedWaste.id,
          amount: weight,
          pointEarned: points,
          status: DepositStatus.COMPLETED,
          createdAt: pastDate,
        },
      });

      await prisma.pointTransaction.create({
        data: {
          memberId: member.id,
          type: PointTransactionType.EARN_DEPOSIT,
          amount: points,
          balanceAfter: member.currentPoints + points, // คำนวณแบบง่ายๆ (ไม่เป๊ะ 100% ถ้ามี concurrent แต่ใช้ seed พอไหว)
          depositId: deposit.id,
          createdBy: admin.id,
          createdAt: pastDate,
          detail: `ฝาก ${selectedWaste.name} ${weight} kg`,
        },
      });

      // อัปเดตแต้มจริง
      await prisma.member.update({
        where: { id: member.id },
        data: {
          currentPoints: { increment: points },
          version: { increment: 1 },
        },
      });
      // อัปเดตค่า Local variable ให้ตรงกัน
      member.currentPoints += points;
    }

    // 5.2 จำลองการแลกของ (Redeem) - เพิ่มส่วนนี้เข้าไป 🔥
    // สุ่มแลกของถ้าแต้มพอ
    const affordableReward = rewards.find(
      (r) => r.costPoint <= member.currentPoints && r.stock > 0,
    );

    if (affordableReward && Math.random() > 0.5) {
      // 50% chance ที่จะแลก
      const redeemDate = new Date(); // แลกวันนี้

      await prisma.rewardRedemption.create({
        data: {
          memberId: member.id,
          rewardId: affordableReward.id,
          pointUsed: affordableReward.costPoint,
          status: RedemptionStatus.COMPLETED,
          createdAt: redeemDate,
        },
      });

      await prisma.pointTransaction.create({
        data: {
          memberId: member.id,
          type: PointTransactionType.SPEND_REDEMPTION,
          amount: -affordableReward.costPoint,
          balanceAfter: member.currentPoints - affordableReward.costPoint,
          detail: `แลกของรางวัล: ${affordableReward.name}`,
          createdAt: redeemDate,
        },
      });

      await prisma.member.update({
        where: { id: member.id },
        data: { currentPoints: { decrement: affordableReward.costPoint } },
      });

      await prisma.reward.update({
        where: { id: affordableReward.id },
        data: { stock: { decrement: 1 } },
      });
    }
  }

  console.log('✅ Transactions seeded (Deposit & Redeem mixed)');
  console.log('🚀 Seeding Completed Successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
