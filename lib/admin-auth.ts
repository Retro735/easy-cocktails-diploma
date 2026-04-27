import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@/lib/generated/prisma/enums";

const adminSessionCookie = "admin_session";
const sessionMaxAgeSeconds = 60 * 60 * 8;
const allowedAdminRoles = new Set<string>([UserRole.ADMIN, UserRole.BARTENDER]);

type AdminSessionPayload = {
  userId: number;
  role: string;
  expiresAt: number;
};

function getSessionSecret() {
  return process.env.ADMIN_SESSION_SECRET ?? "easy-cocktails-admin-dev-secret";
}

function encodePayload(payload: AdminSessionPayload) {
  return Buffer.from(JSON.stringify(payload)).toString("base64url");
}

function decodePayload(value: string) {
  const decoded = Buffer.from(value, "base64url").toString("utf8");
  return JSON.parse(decoded) as AdminSessionPayload;
}

function signPayload(payload: string) {
  return createHmac("sha256", getSessionSecret()).update(payload).digest("base64url");
}

function isValidSignature(payload: string, signature: string) {
  const expectedSignature = signPayload(payload);
  const expected = Buffer.from(expectedSignature);
  const actual = Buffer.from(signature);

  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

function isAllowedAdminRole(role: string) {
  return allowedAdminRoles.has(role);
}

export async function createAdminSession(user: { id: number; role: string }) {
  const payload = encodePayload({
    userId: user.id,
    role: user.role,
    expiresAt: Date.now() + sessionMaxAgeSeconds * 1000,
  });
  const session = `${payload}.${signPayload(payload)}`;
  const cookieStore = await cookies();

  cookieStore.set(adminSessionCookie, session, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: sessionMaxAgeSeconds,
    path: "/",
  });
}

export async function deleteAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(adminSessionCookie);
}

export async function getAdminSessionUser() {
  const cookieStore = await cookies();
  const session = cookieStore.get(adminSessionCookie)?.value;

  if (!session) {
    return null;
  }

  const [payloadValue, signature] = session.split(".");

  if (!payloadValue || !signature || !isValidSignature(payloadValue, signature)) {
    return null;
  }

  try {
    const payload = decodePayload(payloadValue);

    if (
      !Number.isSafeInteger(payload.userId) ||
      payload.expiresAt < Date.now() ||
      !isAllowedAdminRole(payload.role)
    ) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: {
        id: payload.userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    if (!user || !isAllowedAdminRole(user.role)) {
      return null;
    }

    return user;
  } catch {
    return null;
  }
}

export async function requireAdminUser() {
  const user = await getAdminSessionUser();

  if (!user) {
    redirect("/admin/login");
  }

  return user;
}

export function canAdminLogin(role: string) {
  return isAllowedAdminRole(role);
}
