"use client";

import { logout as serverLogout } from "./auth";

export const logout = async () => {
   
  await logout(); // Call the server-side logout function
 window.location.href = "/"; // Redirect to the login page
};