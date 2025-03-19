import { useEffect } from "react";

import { useToast } from "@/hooks/use-toast";

export const useListenErrorToast = (message?: string) => {
  const { toast } = useToast();

  useEffect(() => {
    if (message) toast({ variant: "destructive", description: message });
  }, [message]);
};
