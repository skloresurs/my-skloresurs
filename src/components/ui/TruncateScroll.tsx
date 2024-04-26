"use client";

import type React from "react";
import { useEffect } from "react";
import { activateTextTruncateScroll } from "text-truncate-scroll";

export default function TruncateScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    activateTextTruncateScroll();
  }, []);
  return children;
}
