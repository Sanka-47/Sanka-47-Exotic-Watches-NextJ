"use client";
import { useRouter } from "next/navigation";
import { logout } from "../lib/actions/auth";

export const SignOutButton = () => {
  const router = useRouter();
  return <button onClick={() => logout(router)}> SignOut</button>;
};
