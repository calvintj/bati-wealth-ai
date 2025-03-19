"use client";

import { useCallback, useState } from "react";

/**
 * @deprecated not really usefull, may affect performance and produce bugs
 */
export const useWatchElementProps = <N extends HTMLElement>(
  propsKey: keyof N
) => {
  const [property, setProperty] = useState<N[keyof N] | null>(null);

  const watcher = useCallback(
    (node: N) => {
      setProperty(node[propsKey]);
    },
    [propsKey]
  );

  return [property, watcher];
};
