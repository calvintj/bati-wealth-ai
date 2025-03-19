"use client";

import { useState } from "react";

export interface UseDisclosureReturn {
  onOpen: () => void;
  onClose: () => void;
  isOpen: boolean;
  toggleOpen: () => void;
}

export const useDisclosure = (defaultOpen?: boolean): UseDisclosureReturn => {
  const [isOpen, setIsOpen] = useState(defaultOpen ?? false);

  const onOpen = () => {
    setIsOpen(true);
  };

  const onClose = () => {
    setIsOpen(false);
  };

  const toggleOpen = () => {
    setIsOpen((c) => !c);
  };

  return { isOpen, onClose, onOpen, toggleOpen };
};
