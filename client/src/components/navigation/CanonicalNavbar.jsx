import React from "react";
import { canonicalNavItems } from "../../navigation/canonicalNav";

export default function CanonicalNavbar() {
  const currentPath =
    typeof window !== "undefined" ? window.location.pathname : "/";

  return (
    <nav className="w-full border-b border-[#A8D5BA]/40 bg-[#F7F4EE]/95 sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 py-3">
        <div className="flex flex-wrap items-center gap-2">
          <a
            href="/"
            className="mr-3 rounded-full bg-[#4A7E72] px-4 py-2 text-sm font-bold text-white shadow-sm"
          >
            MyMentalHealthBuddy
          </a>

          {canonicalNavItems.map((item) => {
            const active = currentPath === item.href;
            return (
              <a
                key={item.href}
                href={item.href}
                className={[
                  "rounded-full px-3 py-2 text-sm font-medium transition",
                  active
                    ? "bg-[#F4B942] text-[#1f2933]"
                    : "text-[#2f4f4a] hover:bg-[#A8D5BA]/30 hover:text-[#1f2933]",
                ].join(" ")}
              >
                {item.label}
              </a>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
