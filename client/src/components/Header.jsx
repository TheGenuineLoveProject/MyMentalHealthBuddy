import React from "react";
import { BRAND } from "@shared/brand.mjs";

function NavLink({ href, children, className = "" }) {
  return (
    <a
      href={href}
      className={[
        "inline-flex items-center gap-2 rounded-md px-2 py-1",
        "text-sm text-muted-foreground hover:text-foreground",
        "hover:bg-muted/40",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "ring-offset-background transition",
        className,
      ].join(" ")}
    >
      {children}
    </a>
  );
}

function IconHome(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M3 10.5 12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1v-10.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconGrid(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M4 4h7v7H4V4Zm9 0h7v7h-7V4ZM4 13h7v7H4v-7Zm9 0h7v7h-7v-7Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconGear(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M19.4 15a8.2 8.2 0 0 0 .1-1l2-1.2-2-3.5-2.3.7a7.8 7.8 0 0 0-1.7-1l-.3-2.4H10.7l-.3 2.4c-.6.3-1.2.6-1.7 1L6.4 9.3 4.4 12.8l2 1.2a8.2 8.2 0 0 0 .1 1l-2 1.2 2 3.5 2.3-.7c.5.4 1.1.7 1.7 1l.3 2.4h4.6l.3-2.4c.6-.3 1.2-.6 1.7-1l2.3.7 2-3.5-2-1.2Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Header() {
  return (
    <header
      className={[
        "sticky top-0 z-50 w-full",
        "border-b border-border",
        "bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/70",
      ].join(" ")}
    >
      <div
        className={[
          "mx-auto flex h-14 max-w-6xl items-center",
          // Safe-area padding prevents right/top cut-off on iPad/iPhone
          "pl-[calc(1rem+env(safe-area-inset-left))] pr-[calc(1rem+env(safe-area-inset-right))]",
        ].join(" ")}
      >
        {/* LEFT (kept as flex-1 so the center is truly centered) */}
        <div className="flex flex-1 items-center">
          {/* Optional: add left-side nav later if you want */}
        </div>

        {/* CENTER (true center) */}
        <a
          href="/"
          className={[
            "flex items-center justify-center gap-2",
            "rounded-md px-2 py-1",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "ring-offset-background",
          ].join(" ")}
          aria-label={`${BRAND?.name ?? "Home"} home`}
        >
          <img
            src="/brand/logo.svg"
            alt={BRAND?.name ?? "Logo"}
            className="h-8 w-8"
            draggable="false"
          />
          <span className="hidden sm:inline font-semibold tracking-tight text-foreground">
            {BRAND?.name}
          </span>
        </a>

        {/* RIGHT */}
        <div className="flex flex-1 items-center justify-end">
          <nav className="flex items-center gap-1">
            <NavLink href="/">
              <IconHome className="h-4 w-4" />
              <span className="hidden md:inline">Home</span>
            </NavLink>

            <NavLink href="/dashboard">
              <IconGrid className="h-4 w-4" />
              <span className="hidden md:inline">Dashboard</span>
            </NavLink>

            <NavLink href="/settings">
              <IconGear className="h-4 w-4" />
              <span className="hidden md:inline">Settings</span>
            </NavLink>
          </nav>
        </div>
      </div>
    </header>
  );
}