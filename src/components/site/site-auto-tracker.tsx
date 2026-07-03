"use client";

import { usePathname } from "next/navigation";

import { PageViewTracker } from "@/components/site/page-view-tracker";

export function SiteAutoTracker() {
  const pathname = usePathname();

  if (pathname === "/") {
    return <PageViewTracker path="/" pageType="home" />;
  }

  if (pathname === "/products") {
    return <PageViewTracker path="/products" pageType="products" />;
  }

  if (pathname === "/contact") {
    return <PageViewTracker path="/contact" pageType="contact" />;
  }

  return null;
}
