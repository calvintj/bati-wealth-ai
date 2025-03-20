import fetchReturnPercentage from "@/services/customer-details/return-percentage-api";
import { useQuery } from "@tanstack/react-query";
import { ReturnPercentage } from "@/types/page/customer-details";

const useGetReturnPercentage = (customerID: string) => {
  return useQuery<ReturnPercentage[], Error>({
    queryKey: ["returnPercentage", customerID],
    queryFn: async () => {
      const data = await fetchReturnPercentage(customerID);
      return data;
    },
  });
};

export default useGetReturnPercentage;
