const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const threads = await prisma.emailThread.findMany({
      where: {
        subject: {
          contains: '[KSHETRA]',
          mode: 'insensitive',
        },
      },
      include: {
        customerSite: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        messages: {
          orderBy: {
            sentAt: 'desc',
          },
          take: 1,
        },
      },
      orderBy: {
        lastMessageAt: 'desc',
      },
      skip: 0,
      take: 30,
    });
    console.log("Success:", threads.length);
  } catch (err) {
    console.error("Prisma error:", err);
  } finally {
    await prisma.$disconnect();
  }
}
main();
