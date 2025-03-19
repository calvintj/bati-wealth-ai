"use client";

import { useState } from "react";

export const useToggleValue = <T>(
  values: readonly T[],
  defaultSelectedIndex?: number
) => {
  const [selectedIndex, setSelectedIndex] = useState(defaultSelectedIndex ?? 0);
  const maxIndex = values.length;
  const value = values[selectedIndex];

  const toggleValue = () => {
    if (selectedIndex + 1 < maxIndex) {
      setSelectedIndex(selectedIndex + 1);
    } else {
      setSelectedIndex(0);
    }
  };

  return { value, toggleValue };
};
