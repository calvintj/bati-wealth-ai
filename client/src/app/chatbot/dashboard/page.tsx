import { cookies } from "next/headers";

import DashboardV2 from "./_components/dashboard-v2";

export default async function Page() {
  const cookieStore = await cookies();
  const theme = cookieStore.get("theme")?.value ?? "light";

  console.log(theme, "Cookie Theme");

  return <DashboardV2 theme={theme as "light" | "dark"} />;
}
