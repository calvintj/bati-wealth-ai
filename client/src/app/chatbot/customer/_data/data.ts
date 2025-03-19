import {
  Lock,
  Signal,
  SignalHigh,
  SignalLow,
  SignalMedium,
  SignalZero,
  Star,
} from "lucide-react";

import { CustomerType } from "@/types/customer-v2";
import { FacetedFilterOptions } from "@/types/faceted-filter-options";

export const customerType: FacetedFilterOptions[] = [
  {
    label: CustomerType.Ultra,
    value: CustomerType.Ultra,
    icon: Signal,
  },
  {
    label: CustomerType.VeryHigh,
    value: CustomerType.VeryHigh,
    icon: Signal,
  },
  {
    label: CustomerType.High,
    value: CustomerType.High,
    icon: SignalHigh,
  },
  {
    label: CustomerType.Medium,
    value: CustomerType.Medium,
    icon: SignalMedium,
  },
  {
    label: CustomerType.Low,
    value: CustomerType.Low,
    icon: SignalLow,
  },
];

export const customerPrio: FacetedFilterOptions[] = [
  {
    label: "Priority",
    value: "PRIORITY",
    icon: Star,
  },
  {
    label: "Private",
    value: "PRIVATE",
    icon: Lock,
  },
];

export const transactionLabel: FacetedFilterOptions[] = [
  {
    label: "High",
    value: "HIGH",
    icon: SignalHigh,
  },
  {
    label: "Medium",
    value: "MEDIUM",
    icon: SignalMedium,
  },
  {
    label: "Low",
    value: "LOW",
    icon: SignalLow,
  },
  {
    label: "None",
    value: "NONE",
    icon: SignalZero,
  },
];

export const aumLabel: FacetedFilterOptions[] = [
  {
    label: "High",
    value: "HIGH",
    icon: SignalHigh,
  },
  {
    label: "Medium",
    value: "MEDIUM",
    icon: SignalMedium,
  },
  {
    label: "Low",
    value: "LOW",
    icon: SignalLow,
  },
  {
    label: "None",
    value: "NONE",
    icon: SignalZero,
  },
];
export enum RiskProfile {
  Aggressive = "Aggressive",
  Conservative = "Conservative",
  Moderate = "Moderate",
  Balanced = "Balanced",
  Growth = "Growth",
}
export const riskProfile: FacetedFilterOptions[] = [
  {
    label: RiskProfile.Aggressive,
    value: RiskProfile.Aggressive,
  },
  {
    label: RiskProfile.Moderate,
    value: RiskProfile.Moderate,
  },
  {
    label: RiskProfile.Balanced,
    value: RiskProfile.Balanced,
  },
  {
    label: RiskProfile.Conservative,
    value: RiskProfile.Conservative,
  },
  {
    label: RiskProfile.Growth,
    value: RiskProfile.Growth,
  },
];
