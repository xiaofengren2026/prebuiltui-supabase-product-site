"use client";

import { useEffect } from "react";

const VISITOR_ID_STORAGE_KEY = "product-site-visitor-id";

type PageViewTrackerProps = {
  path: string;
  pageType: string;
  productId?: string | null;
  productName?: string | null;
};

function generateVisitorId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `visitor-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function getVisitorId() {
  const existingId = window.localStorage.getItem(VISITOR_ID_STORAGE_KEY);

  if (existingId) {
    return existingId;
  }

  const nextId = generateVisitorId();
  window.localStorage.setItem(VISITOR_ID_STORAGE_KEY, nextId);

  return nextId;
}

export function PageViewTracker({
  path,
  pageType,
  productId = null,
  productName = null,
}: PageViewTrackerProps) {
  useEffect(() => {
    try {
      const visitorId = getVisitorId();

      void fetch("/api/analytics/track", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        keepalive: true,
        body: JSON.stringify({
          path,
          page_type: pageType,
          product_id: productId,
          product_name: productName,
          visitor_id: visitorId,
          user_agent: navigator.userAgent || null,
          referrer: document.referrer || null,
        }),
      }).then((response) => {
        if (!response.ok) {
          throw new Error(`Track failed with status ${response.status}`);
        }
      }).catch((error) => {
        console.debug("Analytics track failed", error);
      });
    } catch (error) {
      console.debug("Analytics track failed", error);
    }
  }, [path, pageType, productId, productName]);

  return null;
}
