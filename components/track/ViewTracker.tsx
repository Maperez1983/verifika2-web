"use client";

import { useEffect } from "react";

type Props = {
  listingId: string;
};

export default function ViewTracker({ listingId }: Props) {
  useEffect(() => {
    if (!listingId) return;
    const key = `v2_viewed:${listingId}:${new Date().toISOString().slice(0, 10)}`;
    try {
      if (localStorage.getItem(key) === "1") return;
      localStorage.setItem(key, "1");
    } catch {}

    const controller = new AbortController();
    fetch("/api/events/view", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ listing_id: listingId }),
      signal: controller.signal,
    }).catch(() => {});

    return () => controller.abort();
  }, [listingId]);

  return null;
}

