import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
// ASSETS
import Logo from "@/assets/bati-percentage-white.png";

// ICONS
import { RxDashboard } from "react-icons/rx";
import { FaListUl } from "react-icons/fa";
import { IoPersonOutline } from "react-icons/io5";
import { MdOutlineTaskAlt } from "react-icons/md";
import { IoNewspaperOutline } from "react-icons/io5";
import { RiRobot3Line } from "react-icons/ri";
import { BiLogOut } from "react-icons/bi";

const navItems = [
  {
    to: "/overview",
    icon: <RxDashboard className="text-4xl" />,
    label: "Overview",
  },
  {
    to: "/customer-list",
    icon: <FaListUl className="text-4xl" />,
    label: "Customer List",
  },
  {
    to: "/customer-details",
    icon: <IoPersonOutline className="text-4xl" />,
    label: "Customer Details",
  },
  {
    to: "/task-manager",
    icon: <MdOutlineTaskAlt className="text-4xl" />,
    label: "Task Manager",
  },
  {
    to: "/news",
    icon: <IoNewspaperOutline className="text-4xl" />,
    label: "News",
  },
  {
    to: "/chatbot",
    icon: <RiRobot3Line className="text-4xl" />,
    label: "Chatbot",
  },
];

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const linkClass = "text-white hover:text-white p-4 mt-2 rounded-full";

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  return (
    <aside className="w-20 m-2 flex flex-col rounded-2xl items-center bg-[#1D283A]">
      {/* LOGO OR BRAND */}
      <div>
        <Image src={Logo} alt="Bati Logo" className="w-10 h-10 mt-6" />
      </div>

      {/* NAV ITEMS */}
      <nav className="flex flex-col">
        {navItems.map(({ to, icon, label }) => {
          const isActive = pathname === to;
          return (
            <Link
              key={to}
              href={to}
              aria-label={label}
              className={`${linkClass} ${isActive ? "bg-gray-700" : ""}`}
            >
              {icon}
            </Link>
          );
        })}
      </nav>

      {/* LOGOUT */}
      <div className="mt-auto mb-2">
        <button
          className="text-white hover:text-white cursor-pointer"
          onClick={handleLogout}
          aria-label="Logout"
        >
          <BiLogOut className="text-4xl" />
        </button>
      </div>
    </aside>
  );
}
