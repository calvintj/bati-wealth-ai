// ICONS
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { MdOutlineEmail } from "react-icons/md";
import { MdOutlineNotifications } from "react-icons/md";

// HELPERS
import PropTypes from "prop-types";

// ROUTER
import { useLocation } from "react-router-dom";

export default function Navbar({ setCustomerRisk }) {
  const location = useLocation();

  // Array of risk options with their display labels and values
  const riskProfile = [
    { label: "Overall", value: "All" },
    { label: "Conservative", value: "Conservative" },
    { label: "Balanced", value: "Balanced" },
    { label: "Moderate", value: "Moderate" },
    { label: "Growth", value: "Growth" },
    { label: "Aggressive", value: "Aggressive" },
  ];

  return (
    <header className="flex items-center justify-between rounded-2xl bg-[#1D283A] p-2 mt-2 mr-2">
      {/* Left: Only show on /overview */}
      {location.pathname === "/overview" && (
        <Menu as="div" className="relative inline-block ml-2 z-10">
          <div>
            <MenuButton className="cursor-pointer flex w-full rounded-lg p-2 text-sm font-semibold ring-2 ring-white text-white bg-[#1D283A]">
              Risiko
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
        </Menu>
      )}

      {/* Add a spacer div when not on /overview to maintain layout */}
      {location.pathname !== "/overview" && <div />}

      {/* Right: Notification, Email, RM */}
      <div className="flex items-center gap-4 mr-2">
        <MdOutlineEmail className="text-white text-4xl cursor-pointer" />
        <MdOutlineNotifications className="text-white text-4xl cursor-pointer" />

        <div className="bg-gray-700 text-white p-2 rounded-full w-10 h-10">
          RM
        </div>
      </div>
    </header>
  );
}

Navbar.propTypes = {
  setCustomerRisk: PropTypes.func.isRequired,
};
