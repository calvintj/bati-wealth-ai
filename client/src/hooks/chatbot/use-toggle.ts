"use client";

import { useState } from "react";

export const useToggle = (defaultValue?: boolean) => {
  const [value, setValue] = useState(defaultValue ?? false);

  const toggleValue = () => {
    setValue(() => !value);
  };

  return [value, toggleValue, setValue] as const;
};
