"use client";

import { useCallback, useRef,useState } from "react";

type CopiedValue = string | null;
type CopyFn = (text: string) => Promise<boolean>;

export function useCopyToClipboard(): [CopiedValue, CopyFn] {
  const [copiedText, setCopiedText] = useState<CopiedValue>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetCopiedText = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setCopiedText(null);
    }, 2000); // Reset after 2 seconds, like Chakra UI's feedback time
  }, []);

  const copy: CopyFn = useCallback(
    async (text) => {
      if (!navigator?.clipboard) {
        console.warn("Clipboard not supported");
        return false;
      }

      try {
        await navigator.clipboard.writeText(text);
        setCopiedText(text);
        resetCopiedText();
        return true;
      } catch (error) {
        console.warn("Copy failed", error);
        setCopiedText(null);
        return false;
      }
    },
    [resetCopiedText]
  );

  return [copiedText, copy];
}
