"use server";

import { signIn, signOut } from "@/app/api/auth/[...nextauth]/auth";

export const login = async () => {
  await signIn("google", { redirectTo: "/" });
};

export const logout = async (router: any) => {
  await signOut();
  router.refresh();
};
