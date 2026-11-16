import { redirect } from "next/navigation";
import { auth } from "@/auth";

export class UnauthorizedError extends Error {
  constructor(message = "You do not have permission to perform this action.") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

/**
 * Pages call this even though their layout also guards, because Next renders
 * layouts and pages in parallel: without a page-level guard the page would run
 * its database queries before the layout redirect is resolved.
 */
export async function getCurrentUser() {
  const session = await auth();
  return session?.user ?? null;
}

export async function isAdmin() {
  const user = await getCurrentUser();
  return user?.role === "ADMIN";
}

/** Page guards redirect; action/route guards throw. */
export async function requireUserPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/signIn");
  return user;
}

export async function requireAdminPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/signIn");
  if (user.role !== "ADMIN") redirect("/");
  return user;
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) throw new UnauthorizedError("You must be signed in to perform this action.");
  return user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== "ADMIN") throw new UnauthorizedError();
  return user;
}
