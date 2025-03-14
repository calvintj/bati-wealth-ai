import { Suspense } from "react";
import CustomerDetailContent from "@/components/customer-details/customer-details-content";

export default function CustomerDetailsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CustomerDetailContent />
    </Suspense>
  );
}
