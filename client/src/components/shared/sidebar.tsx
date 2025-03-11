// ROUTER
import { NavLink, useNavigate } from "react-router-dom";

// ASSETS
import Logo from "../assets/Persen White.png";

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
  const navigate = useNavigate();
  const linkClass = "text-white hover:text-white p-4 mt-2 rounded-full";

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <aside className="w-20 m-2 flex flex-col rounded-2xl items-center bg-[#1D283A]">
      {/* LOGO OR BRAND */}
      <div>
        <img src={Logo} alt="Bati Logo" className="w-10 h-10 mt-6" />
      </div>

      {/* NAV ITEMS */}
      <nav className="flex flex-col">
        {navItems.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            aria-label={label}
            className={({ isActive }) =>
              `${linkClass} ${isActive ? "bg-gray-700" : ""}`
            }
          >
            {icon}
          </NavLink>
        ))}
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
