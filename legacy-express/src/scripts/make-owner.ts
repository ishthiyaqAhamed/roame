import { prisma } from "../db";

const emailToPromote = process.argv[2];

if (!emailToPromote) {
  console.error("Usage: npx tsx src/scripts/make-owner.ts <email>");
  process.exit(1);
}

async function main() {
  const user = await prisma.user.update({
    where: { email: emailToPromote },
    data: { role: "OWNER" },
  });
  console.log(`✅ ${user.email} is now an OWNER`);
}

main()
  .catch((err) => console.error("Error:", err))
  .finally(() => prisma.$disconnect());