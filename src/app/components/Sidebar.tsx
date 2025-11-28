"use client";
import Link from "next/link";
import taskIcon from "@/../public/icons/task-manager.svg";
import dashboardIcon from "@/../public/icons/dashboard.svg";
import settingIcon from "@/../public/icons/settings.svg";
import calendarIcon from "@/../public/icons/calender.svg";
import patientIcon from "@/../public/icons/patient.svg";
import LinkIcon from "@/../public/icons/link.svg";
import Image from "next/image";
import { LogOutIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { authAPI } from "../lib/authAPI";

function Sidebars() {
  const pathname = usePathname();
  const router = useRouter();

  const links = [
    { href: "/dashboard", label: "Dashboard", icon: dashboardIcon },
    { href: "/task-manager", label: "Task Manager", icon: taskIcon },
    { href: "/patient-manager", label: "Patient Management", icon: patientIcon },
    { href: "/linked-tools", label: "Linked Tools", icon: LinkIcon },
    { href: "/calender", label: "Calendar", icon: calendarIcon },
    { href: "/settings", label: "Settings", icon: settingIcon },
  ];

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <aside className="sticky top-20 h-[calc(100vh-5rem)] w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm">
      <nav className="flex flex-col gap-2  mt-4 p-4 flex-1 overflow-y-auto">
        {links.map(({ href, label, icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 py-3 px-4 rounded-xl text-[15px] font-semibold transition-all duration-200 ${
                isActive
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "text-gray-700 hover:bg-gray-50 hover:text-primary"
              }`}
            >
              <Image
                src={icon}
                alt={`${label} icon`}
                width={22}
                height={22}
                className={isActive ? "brightness-0 invert" : "opacity-70"}
              />
              <span className={isActive ? "font-bold" : "font-medium"}>{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-200 bg-gray-50/50">
        <button
          onClick={handleLogout}
          className="w-full bg-gray-100 hover:bg-red-600 py-3 px-4 flex items-center justify-center gap-2.5 text-[15px] font-semibold text-gray-700 hover:text-white rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <LogOutIcon className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebars;
