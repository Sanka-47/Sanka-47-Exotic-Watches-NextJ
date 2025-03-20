"use client";

import { logout as serverLogout } from "./auth";

export const logout = async () => {
   
  await serverLogout(); // Call the server-side logout function
 
};