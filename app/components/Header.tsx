import { useState } from "react";
import { NavLink } from "react-router";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

const navItems = [
  { to: "/", label: "Products" },
  { to: "/raw-materials", label: "Raw Materials" },
  { to: "/production", label: "Product Production" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="bg-indigo-700 shadow-lg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo / Brand */}
          <div className="flex-shrink-0">
            <span className="text-xl font-bold text-white tracking-wide">
              Product Manager
            </span>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex md:space-x-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  `rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-indigo-900 text-white"
                      : "text-indigo-100 hover:bg-indigo-600 hover:text-white"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md p-2 text-indigo-200 hover:bg-indigo-600 hover:text-white md:hidden"
            onClick={() => setMobileOpen((prev) => !prev)}
          >
            {mobileOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav className="space-y-1 px-4 pb-4 md:hidden">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `block rounded-md px-3 py-2 text-base font-medium transition-colors ${
                  isActive
                    ? "bg-indigo-900 text-white"
                    : "text-indigo-100 hover:bg-indigo-600 hover:text-white"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
}
