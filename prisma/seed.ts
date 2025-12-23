import {
  PrismaClient,
  UserRole,
  DepositStatus,
  PointTransactionType,
  MemberStatus,
} from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Start seeding data...');

  // 1. ล้างข้อมูลเก่าก่อน (เรียงตามลำดับ FK เพื่อไม่ให้ Error)
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
      pointRate: 10.0, // 10 แต้ม/กก.
      marketPrice: 5.0, // ราคารับซื้อจริง
      unit: 'KG',
      imageUrl:
        'https://images.unsplash.com/photo-1595278069441-2cf29f525a3c?auto=format&fit=crop&q=80&w=300',
      description: 'ขวดน้ำดื่มใส ล้างสะอาด',
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
    },
  });

  console.log('✅ Waste Types created');

  // 3. สร้าง User (Admin 1 คน, Member 10 คน)
  const hashedPassword = await bcrypt.hash('123456', 10); // Password: 123456

  // 3.1 Admin
  const admin = await prisma.member.create({
    data: {
      email: 'admin@demo.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'System',
      role: UserRole.ADMIN,
      phoneNumber: '0999999999',
    },
  });

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
        phoneNumber: `080000000${i}`,
        currentPoints: 0,
      },
    });
    members.push(member);
  }
  console.log('✅ Users created (Password: 123456)');

  // 4. สร้างของรางวัล (Rewards)
  await prisma.reward.createMany({
    data: [
      {
        name: 'ส่วนลดค่าไฟ 50 บาท',
        description: 'ใช้เป็นส่วนลดบิลค่าไฟเดือนถัดไป',
        costPoint: 500, // แก้ชื่อ field ให้ตรงกับ redeem.service.ts
        stock: 100,
        imageUrl:
          'https://images.unsplash.com/photo-1550565118-3a1400d786e9?auto=format&fit=crop&q=80&w=300',
      },
      {
        name: 'ถุงผ้าลดโลกร้อน',
        description: 'ลาย Limited Edition',
        costPoint: 200,
        stock: 50,
        imageUrl:
          'https://images.unsplash.com/photo-1597484661643-2f5fef640dd1?auto=format&fit=crop&q=80&w=300',
      },
      {
        name: 'แก้วเก็บความเย็น',
        description: 'เก็บความเย็นได้ 24 ชม.',
        costPoint: 1000,
        stock: 20,
        imageUrl:
          'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=300',
      },
      {
        name: 'คูปองกาแฟ',
        description: 'Starbucks 100.-',
        costPoint: 800,
        stock: 0, // ของหมด (ไว้เทส case ของหมด)
        imageUrl:
          'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=300',
      },
    ],
  });
  console.log('✅ Rewards created');

  // 5. จำลอง Transaction (เพื่อให้กราฟ Dashboard พุ่ง)
  // ให้ Member แต่ละคนมีการฝากขยะคนละ 3-5 ครั้ง ในช่วง 30 วันที่ผ่านมา
  const wasteTypes = [plastic, can, glass, paper];

  for (const member of members) {
    const txCount = Math.floor(Math.random() * 3) + 3; // 3-5 transactions

    for (let j = 0; j < txCount; j++) {
      const selectedWaste =
        wasteTypes[Math.floor(Math.random() * wasteTypes.length)];
      const weight = Math.floor(Math.random() * 10) + 1; // 1-10 kg
      const points = Math.floor(weight * Number(selectedWaste.pointRate));

      // วันที่ย้อนหลัง (กระจายๆ กันไป)
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - Math.floor(Math.random() * 30));

      // 5.1 สร้าง Deposit
      const deposit = await prisma.deposit.create({
        data: {
          memberId: member.id,
          wasteTypeId: selectedWaste.id,
          amount: weight,
          pointEarned: points,
          status: DepositStatus.COMPLETED,
          createdAt: pastDate, // สำคัญ! เพื่อให้กราฟตามเวลามันขึ้น
        },
      });

      // 5.2 สร้าง Point Log
      await prisma.pointTransaction.create({
        data: {
          memberId: member.id,
          type: PointTransactionType.EARN_DEPOSIT,
          amount: points,
          balanceAfter: member.currentPoints + points, // (ค่าประมาณ)
          depositId: deposit.id,
          createdBy: admin.id,
          createdAt: pastDate,
        },
      });

      // 5.3 อัปเดตแต้มจริงของ User
      await prisma.member.update({
        where: { id: member.id },
        data: {
          currentPoints: { increment: points },
          version: { increment: 1 },
        },
      });
    }
  }

  console.log('✅ Transactions seeded (Dashboard is ready!)');
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
