// ICONS
import {
  Menu as HeadlessMenu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
// import { Bell, Mail } from "lucide-react";
// import { Button } from "@/components/ui/button";

// ROUTER
import { usePathname } from "next/navigation";
import Image from "next/image";
import { ColorModeToggle } from "@/components/chatbot/color-mode-toggle";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { VisuallyHidden } from "@/components/ui/visually-hidden";

// Import the navigation items from sidebar
import { navItems } from "./sidebar";

export default function Navbar({
  setCustomerRisk,
  customerRisk,
}: {
  setCustomerRisk: (risk: string) => void;
  customerRisk: string;
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Array of risk options with their display labels and values
  const riskProfile = [
    { label: "Overall", value: "All" },
    { label: "Conservative", value: "Conservative" },
    { label: "Balanced", value: "Balanced" },
    { label: "Moderate", value: "Moderate" },
    { label: "Growth", value: "Growth" },
    { label: "Aggressive", value: "Aggressive" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  return (
    <nav className="w-auto p-4 mt-2 mx-2 md:mx-2 flex items-center justify-between bg-[#1D283A] rounded-2xl">
      <div className="flex items-center gap-4">
        {/* Hamburger menu for mobile */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-[240px] p-4 bg-[#1D283A] text-white"
          >
            <SheetTitle>
              <VisuallyHidden>Navigation Menu</VisuallyHidden>
            </SheetTitle>
            <div className="py-4">
              <Image
                src="/bati-dark.svg"
                alt="Bati Logo"
                width={120}
                height={36}
              />
            </div>
            <nav className="flex flex-col gap-2">
              {navItems.map(({ to, icon, label }) => {
                const isActive = pathname === to;
                return (
                  <Link
                    key={to}
                    href={to}
                    className={`flex items-center gap-3 p-3 rounded-lg ${
                      isActive ? "bg-[#0077E4]" : "hover:bg-[#2D385A]"
                    }`}
                    onClick={() => setOpen(false)}
                  >
                    <span className="[&>svg]:w-5 [&>svg]:h-5">{icon}</span>
                    <span>{label}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="mt-auto pt-8">
              <button
                className="flex items-center gap-3 p-3 rounded-lg w-full hover:bg-[#2D385A]"
                onClick={() => {
                  handleLogout();
                  setOpen(false);
                }}
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </SheetContent>
        </Sheet>

        {/* Logo - visible on both mobile and desktop */}
        <Image
          src="/bati-dark.svg"
          alt="Bati Logo"
          width={100}
          height={30}
          className="md:w-[120px] md:h-[36px]"
        />
        {/* Left: Only show on /overview */}
        <div className="flex items-center gap-2">
          {pathname === "/dashboard-overview" && (
            <HeadlessMenu as="div" className="relative inline-block ml-2 z-10">
              <div>
                <MenuButton className="cursor-pointer flex w-full rounded-lg p-2 text-sm font-semibold ring-2 ring-white text-white bg-[#1D283A]">
                  {customerRisk === "All"
                    ? "Risiko"
                    : riskProfile.find((risk) => risk.value === customerRisk)
                        ?.label}
                  <ChevronDownIcon className="w-5 h-5 text-white" />
                </MenuButton>
              </div>
              <MenuItems
                transition
                className="absolute mt-2 w-30 rounded-md text-white border-2 border-white bg-[#1D283A] transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
              >
                <div>
                  {riskProfile.map((risk) => (
                    <MenuItem key={risk.value}>
                      <button
                        type="button"
                        onClick={() => setCustomerRisk(risk.value)}
                        className="cursor-pointer w-full px-4 py-2 text-left text-sm data-focus:bg-gray-100 data-focus:text-gray-900"
                      >
                        {risk.label}
                      </button>
                    </MenuItem>
                  ))}
                </div>
              </MenuItems>
            </HeadlessMenu>
          )}
        </div>
      </div>

      {/* Add a spacer div when not on /overview to maintain layout */}
      {pathname !== "/dashboard-overview" && <div />}

      {/* Right: Notification, Email, RM */}
      <div className="flex items-center gap-2 md:gap-4 mr-2">
        <ColorModeToggle className="cursor-pointer" />
        {/* <Button variant="ghost" size="icon">
          <Mail />
        </Button>
        <Button variant="ghost" size="icon">
          <Bell />
        </Button> */}
        <div className="bg-gray-700 text-white p-1.5 md:p-2 rounded-full w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-sm md:text-base">
          RM
        </div>
      </div>
    </nav>
  );
}
