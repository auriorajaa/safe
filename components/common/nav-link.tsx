"use client";

import { handleNavigationWithLoading } from "@/lib/navigation-utils";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import React from "react";

export default function NavLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  const pathname = usePathname();
  const isActive =
    pathname === href || (href !== "/" && pathname.startsWith(href));

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    handleNavigationWithLoading(e, href);
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className={cn(
        "transition-colors text-sm duration-200 text-gray-500 hover:text-blue-600",
        className
      )}
    >
      {children}
    </a>
  );
}
