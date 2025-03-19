"use server";

import { cookies } from "next/headers";

export async function setThemeCookie(theme: "light" | "dark") {
  const cookieStore = await cookies();
  cookieStore.set("theme", theme);
}
