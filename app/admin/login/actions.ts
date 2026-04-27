"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { canAdminLogin, createAdminSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

function getRequiredValue(formData: FormData, field: string) {
  const value = formData.get(field);

  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function redirectToLoginError(): never {
  redirect("/admin/login?error=invalid");
}

export async function loginAdmin(formData: FormData) {
  const email = getRequiredValue(formData, "email").toLowerCase();
  const password = getRequiredValue(formData, "password");

  if (!email || !password) {
    redirectToLoginError();
  }

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
      email: true,
      password: true,
      role: true,
    },
  });

  const isPasswordValid = user
    ? await bcrypt.compare(password, user.password)
    : false;

  if (!user || !isPasswordValid || !canAdminLogin(user.role)) {
    redirectToLoginError();
  }

  await createAdminSession(user);
  redirect("/admin");
}
