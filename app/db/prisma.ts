import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;

// async function seedSubscriptions() {
//   try {
//     const existingSubscriptions = await prisma.subscription.findMany();

//     if (existingSubscriptions.length === 0) {
//       await prisma.subscription.createMany({
//         data: [
//           { type: '三天', price: 9.9 },
//           { type: '月卡', price: 29.9 },
//           { type: '季卡', price: 89.9 },
//           { type: '年卡', price: 299.9 },
//         ],
//       });

//       console.log('订阅数据已成功填充。');
//     } else {
//       console.log('订阅数据已存在，无需填充。');
//     }
//   } catch (error) {
//     console.error('填充订阅数据时出现错误：', error);
//   } finally {
//     await prisma.$disconnect();
//   }
// }

// seedSubscriptions();
