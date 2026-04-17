import "server-only";

import { createHmac, randomBytes, scrypt as nodeScrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { countUsers, findUserByEmail, findUserById, saveUser } from "@/lib/storage";
import type { UserRecord } from "@/lib/types";

const scrypt = promisify(nodeScrypt);
const sessionCookieName = "ash_tra_session";

function getSessionSecret() {
  return process.env.SESSION_SECRET || "ash-tra-local-dev-secret";
}

function shouldUseSecureCookies() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "";
  const isLocalHttpUrl = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(appUrl);
  return process.env.NODE_ENV === "production" && !isLocalHttpUrl;
}

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derived = (await scrypt(password, salt, 64)) as Buffer;
  return `${salt}:${derived.toString("hex")}`;
}

async function verifyPassword(password: string, storedHash: string) {
  const [salt, hexHash] = storedHash.split(":");
  if (!salt || !hexHash) {
    return false;
  }

  const derived = (await scrypt(password, salt, 64)) as Buffer;
  const storedBuffer = Buffer.from(hexHash, "hex");

  if (storedBuffer.length !== derived.length) {
    return false;
  }

  return timingSafeEqual(storedBuffer, derived);
}

function signToken(payload: string) {
  return createHmac("sha256", getSessionSecret()).update(payload).digest("base64url");
}

function encodeSession(user: UserRecord) {
  const payload = Buffer.from(
    JSON.stringify({
      userId: user.id,
      role: user.role,
      exp: Date.now() + 1000 * 60 * 60 * 24 * 14,
    }),
  ).toString("base64url");

  return `${payload}.${signToken(payload)}`;
}

function decodeSession(token: string) {
  const [payload, signature] = token.split(".");
  if (!payload || !signature || signToken(payload) !== signature) {
    return null;
  }

  const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
    userId: string;
    role: UserRecord["role"];
    exp: number;
  };

  if (parsed.exp < Date.now()) {
    return null;
  }

  return parsed;
}

export async function createUserSession(user: UserRecord) {
  const cookieStore = await cookies();
  cookieStore.set(sessionCookieName, encodeSession(user), {
    httpOnly: true,
    sameSite: "lax",
    secure: shouldUseSecureCookies(),
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });
}

export async function clearUserSession() {
  const cookieStore = await cookies();
  cookieStore.delete(sessionCookieName);
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(sessionCookieName)?.value;
  if (!token) {
    return null;
  }

  const session = decodeSession(token);
  if (!session) {
    return null;
  }

  return findUserById(session.userId);
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  return user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== "admin") {
    redirect("/dashboard");
  }

  return user;
}

export async function registerLocalUser(input: {
  name: string;
  email: string;
  password: string;
}) {
  const existingUser = await findUserByEmail(input.email);
  if (existingUser) {
    throw new Error("An account already exists for that email.");
  }

  const userCount = await countUsers();
  const user: UserRecord = {
    id: randomBytes(10).toString("hex"),
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    passwordHash: await hashPassword(input.password),
    role: userCount === 0 ? "admin" : "customer",
    createdAt: new Date().toISOString(),
  };

  await saveUser(user);
  return user;
}

export async function authenticateLocalUser(email: string, password: string) {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error("No account matched that email.");
  }

  const passwordValid = await verifyPassword(password, user.passwordHash);
  if (!passwordValid) {
    throw new Error("The password was not correct.");
  }

  return user;
}
