import fetchOfferProductList from "../../services/task-manager/offer-products-list-api";
import { useQuery } from "@tanstack/react-query";
import { OfferProductRiskResponse } from "@/types/task-manager";

const useOfferProductRisk = () => {
  return useQuery<OfferProductRiskResponse, Error>({
    queryKey: ["offerProductRisk"],
    queryFn: fetchOfferProductList,
    staleTime: 5 * 60 * 1000,
  });
};

export default useOfferProductRisk;
