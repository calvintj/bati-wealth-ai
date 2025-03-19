"use client";
import { useEffect } from "react";

export const useLockBodyScroll = (condition?: boolean) => {
  useEffect(() => {
    if (condition) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [condition]);
};
