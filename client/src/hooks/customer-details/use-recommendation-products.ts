import fetchRecommendationProduct from "@/services/customer-details/recommendation-products-api";
import { useQuery } from "@tanstack/react-query";
import { RecommendationProduct } from "@/types/page/customer-details";

const useGetRecommendationProduct = (customerID: string) => {
  return useQuery<RecommendationProduct[], Error>({
    queryKey: ["recommendationProduct", customerID],
    queryFn: async () => {
      const data = await fetchRecommendationProduct(customerID);
      return data;
    },
    enabled: !!customerID,
  });
};

export default useGetRecommendationProduct;
