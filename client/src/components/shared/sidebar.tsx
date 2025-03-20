import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

// ICONS
import {
  LayoutDashboard,
  List,
  User,
  CircleCheckBig,
  Newspaper,
  Bot,
  LogOut,
} from "lucide-react";

const navItems = [
  {
    to: "/overview",
    icon: <LayoutDashboard />,
    label: "Overview",
  },
  {
    to: "/customer-list",
    icon: <List />,
    label: "Customer List",
  },
  {
    to: "/customer-details",
    icon: <User />,
    label: "Customer Details",
  },
  {
    to: "/task-manager",
    icon: <CircleCheckBig />,
    label: "Task Manager",
  },
  {
    to: "/news",
    icon: <Newspaper />,
    label: "News",
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
  const linkClass = "mt-2 rounded-2xl p-2 [&>svg]:!w-8 [&>svg]:!h-8 text-white";

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  return (
    <aside className="w-15 m-2 flex flex-col rounded-2xl items-center bg-[#1D283A]">
      <nav className="flex flex-col">
        {navItems.map(({ to, icon, label }) => {
          const isActive = pathname === to;
          return (
            <Link
              key={to}
              href={to}
              aria-label={label}
              className={`${linkClass} ${isActive ? "bg-[#0077E4]" : ""}`}
            >
              {icon}
            </Link>
          );
        })}
      </nav>

      {/* LOGOUT */}
      <div className="mt-auto">
        <button
          className="text-white hover:text-white cursor-pointer p-4 [&>svg]:!w-8 [&>svg]:!h-8"
          onClick={handleLogout}
          aria-label="Logout"
        >
          <LogOut />
        </button>
      </div>
    </aside>
  );
}
