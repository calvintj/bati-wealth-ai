import fetchOwnedProduct from "@/services/customer-details/owned-products-api";
import { useQuery } from "@tanstack/react-query";
import { OwnedProduct } from "@/types/page/customer-details";

const useOwnedProduct = (customerID: string) => {
  return useQuery<OwnedProduct[], Error>({
    queryKey: ["ownedProduct", customerID],
    queryFn: async () => {
      const data = await fetchOwnedProduct(customerID);
      return data;
    },
    enabled: !!customerID,
  });
};

export default useOwnedProduct;
