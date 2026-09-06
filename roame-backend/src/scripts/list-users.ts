import { prisma } from "../db";

async function main() {
  const users = await prisma.user.findMany();
  console.log(JSON.stringify(users, null, 2));
}

main().finally(() => prisma.$disconnect());