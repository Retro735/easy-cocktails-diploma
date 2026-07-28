import "dotenv/config";

import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";
import { UserRole } from "../lib/generated/prisma/enums";

const demoAccountEmails = [
  "admin@easybar.local",
  "bartender@easybar.local",
];

async function main() {
  const email = process.env.ADMIN_SETUP_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_SETUP_PASSWORD;

  if (!email || !email.includes("@")) {
    throw new Error("Укажи корректный ADMIN_SETUP_EMAIL в файле .env");
  }

  if (!password || password.length < 12) {
    throw new Error(
      "ADMIN_SETUP_PASSWORD должен содержать не менее 12 символов",
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.deleteMany({
    where: {
      email: {
        in: demoAccountEmails,
      },
      NOT: {
        email,
      },
    },
  });

  await prisma.user.upsert({
    where: {
      email,
    },
    update: {
      name: "Администратор",
      password: passwordHash,
      role: UserRole.ADMIN,
    },
    create: {
      name: "Администратор",
      email,
      password: passwordHash,
      role: UserRole.ADMIN,
    },
  });

  console.log(`Учётная запись администратора настроена: ${email}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });