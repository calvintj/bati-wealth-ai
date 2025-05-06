import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/shift-away.css";

// ICONS
import {
  LayoutDashboard,
  List,
  User,
  CircleCheckBig,
  ChartLine,
  Bot,
  LogOut,
} from "lucide-react";

// Export navItems so Navbar can access them
export const navItems = [
  {
    to: "/dashboard-overview",
    icon: <LayoutDashboard />,
    label: "Dashboard Overview",
  },
  {
    to: "/customer-mapping",
    icon: <List />,
    label: "Customer Mapping",
  },
  {
    to: "/recommendation-centre",
    icon: <CircleCheckBig />,
    label: "Recommendation Centre",
  },
  {
    to: "/customer-details",
    icon: <User />,
    label: "Customer Details",
  },
  {
    to: "/market-indices",
    icon: <ChartLine />,
    label: "Market Indices",
  },
  {
    to: "/chatbot",
    icon: <Bot />,
    label: "Chatbot",
  },
];

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const linkClass = "[&>svg]:!w-8 [&>svg]:!h-8 text-black dark:text-white";

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  // Only render the desktop sidebar - mobile will be handled by navbar
  return (
    <aside className="my-2 ml-2 hidden md:flex flex-col rounded-2xl items-center border-1 border-gray-300 dark:border-none bg-white dark:bg-[#1D283A]">
      <nav className="flex flex-col">
        {navItems.map(({ to, icon, label }) => {
          const isActive = pathname === to;
          return (
            <Tippy
              key={to}
              content={label}
              placement="right"
              animation="shift-away"
              arrow={true}
              theme="dark"
              delay={[300, 0]} // [show delay, hide delay] in ms
            >
              <div
                className={`mt-2 rounded-2xl p-2 ${
                  isActive ? "bg-[#0077E4]" : ""
                }`}
              >
                <Link href={to} aria-label={label} className={linkClass}>
                  {icon}
                </Link>
              </div>
            </Tippy>
          );
        })}
      </nav>

      {/* LOGOUT */}
      <div className="mt-auto">
        <Tippy
          content="Logout"
          placement="right"
          animation="shift-away"
          arrow={true}
          theme="dark"
          delay={[300, 0]}
        >
          <button
            className="text-black dark:text-white hover:text-black dark:hover:text-white cursor-pointer p-4 [&>svg]:!w-8 [&>svg]:!h-8"
            onClick={handleLogout}
            aria-label="Logout"
          >
            <LogOut />
          </button>
        </Tippy>
      </div>
    </aside>
  );
}
