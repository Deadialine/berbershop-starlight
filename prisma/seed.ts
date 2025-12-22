import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const services = [
    { name: "Signature Fade", durationMinutes: 45, priceText: "$45" },
    { name: "Skin Fade + Beard", durationMinutes: 60, priceText: "$65" },
    { name: "Beard Sculpt & Hot Towel", durationMinutes: 30, priceText: "$35" },
    { name: "Kids Cut", durationMinutes: 30, priceText: "$30" },
    { name: "Buzz & Clean Up", durationMinutes: 25, priceText: "$28" },
    { name: "Razor Shave", durationMinutes: 35, priceText: "$40" },
    { name: "Wash & Style", durationMinutes: 25, priceText: "$25" },
    { name: "Line Up", durationMinutes: 20, priceText: "$20" },
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: { name: service.name },
      update: {},
      create: { ...service, isActive: true },
    });
  }

  const adminEmail = process.env.ADMIN_EMAIL || "owner@starlight.test";
  const adminPassword = process.env.ADMIN_PASSWORD || "ChangeMe123!";
  const passwordHash = await bcrypt.hash(adminPassword, 10);
  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: { passwordHash },
    create: { email: adminEmail, passwordHash, name: "Owner" },
  });

  console.log("Seed complete");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
