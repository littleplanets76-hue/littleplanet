
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import { sidebarIcons } from "@/components/sidebarIcons";

const sidebarLinks = [
  { label: "Admission Form", href: "/" },
  { label: "Parents", href: "/parents" },
  { label: "Students", href: "/students" },
  { label: "Teachers", href: "/teachers" },
  { label: "Talent Hunt", href: "/talenthunt" },
  { label: "Notice", href: "/notice" },
];

// Maroon-red from logo: #8B1F1F
export default function Sidebar() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  return (
    <>
      {/* Mobile Toggle Button at top left */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden bg-[#8B1F1F] text-white p-3 rounded-full shadow-lg focus:outline-none"
        onClick={() => setOpen((v) => !v)}
        aria-label="Toggle sidebar"
      >
        {open ? (
          <span>&#10005;</span>
        ) : (
          <span>&#9776;</span>
        )}
      </button>
      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 h-screen w-64 bg-white shadow-xl flex flex-col p-6 z-20 transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
        style={{ minWidth: 240 }}
      >
        <div className="flex flex-col items-center mb-10">
          <Image
            src="/logo.jpeg"
            alt="Logo"
            width={180}
            height={180}
            priority
          />
        </div>
        <nav className="flex-1 w-full">
          <ul className="space-y-2">
            {sidebarLinks.map((link) => {
              const Icon = sidebarIcons[link.label];
              const isActive = router.pathname === link.href;
              const isDisabled = link.label === "Teachers" || link.label === "Notice";
              return (
                <li key={link.href}>
                  {!isDisabled ? (
                    <Link
                      href={link.href}
                      className={`flex items-center px-4 py-3 rounded-lg font-medium transition-colors group
                        hover:bg-[#8B1F1F]/10 hover:text-[#8B1F1F]
                        ${isActive ? "bg-[#8B1F1F]/10 text-[#8B1F1F] font-bold" : "text-black"}
                      `}
                      onClick={() => setOpen(false)}
                    >
                      {Icon && <Icon className={`text-2xl mr-4 ${isActive ? "text-[#8B1F1F]" : "group-hover:text-[#8B1F1F]"}`} />}
                      <span className={`tracking-wide text-base ${isActive ? "text-[#8B1F1F]" : "group-hover:text-[#8B1F1F]"}`}>{link.label}</span>
                    </Link>
                  ) : (
                    <span
                      className="flex items-center px-4 py-3 rounded-lg font-medium  cursor-not-allowed select-none "
                    >
                      {Icon && <Icon className="text-2xl mr-4 " />}
                      <span className="tracking-wide text-base">{link.label}</span>
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
      {/* Overlay for mobile when sidebar is open */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-10 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}
