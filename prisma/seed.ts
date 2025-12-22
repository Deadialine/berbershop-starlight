import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const services = [
    { name: "Κούρεμα", durationMinutes: 30, priceText: "€10" },
    { name: "Fade", durationMinutes: 40, priceText: "€12" },
    { name: "Ξύρισμα/Σχήμα Γενειάδας", durationMinutes: 20, priceText: "€5" },
    { name: "Fade + Γένια", durationMinutes: 55, priceText: "€17" },
    { name: "Κούρεμα Παιδικό", durationMinutes: 30, priceText: "€10" },
    { name: "Λούσιμο & Styling", durationMinutes: 20, priceText: "€6" },
    { name: "Line Up / Καθάρισμα", durationMinutes: 20, priceText: "€8" },
    { name: "Ξυριστική Τελετουργία", durationMinutes: 35, priceText: "€9" },
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
