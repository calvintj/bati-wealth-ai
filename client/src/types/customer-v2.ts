export enum AUMLabel {
  Low = "Low",
  Medium = "Medium",
  High = "High",
  Zero = "Zero",
}

export enum TransactionLabel {
  Low = "Low",
  Medium = "Medium",
  High = "High",
  None = "None",
}

export enum Propensity {
  Low = "Low",
  Medium = "Medium",
  High = "High",
  Qualified = "Qualified",
}

export enum RiskProfile {
  Aggressive = "Aggressive",
  Conservative = "Conservative",
  Moderate = "Moderate",
  Balanced = "Balanced",
  Growth = "Growth",
}

export enum CustomerType {
  High = "High Net Worth",
  VeryHigh = "Very High Net Worth",
  Ultra = "Ultra High Net Worth",
  Low = "Low Net Worth",
  Medium = "Medium Net Worth",
}

export interface Customer {
  customerId: number;
  assignedRm: string;
  customerType: CustomerType;
  priorityPrivate: "Priority";
  transactionLabel: TransactionLabel;
  aumLabel: AUMLabel;
  propensityBAC: Propensity;
  propensitySB: Propensity;
  propensityRD: Propensity;
  scoreOverall: number;
  scoreBAC: number;
  scoreSB: number;
  scoreRD: number;
  riskProfile: RiskProfile;
  customerName: string;
}

export interface JsonCustomer {
  ["Customer ID"]: number;
  ["Assigned RM"]: string;
  ["Customer Type"]: CustomerType;
  ["Priority/Private"]: "Priority";
  ["Transaction Label"]: TransactionLabel;
  ["AUM Label"]: AUMLabel;
  ["Propensity BAC"]: Propensity;
  ["Propensity SB"]: Propensity;
  ["Propensity RD"]: Propensity;
  ["Score Overall"]: number;
  ["Score BAC"]: number;
  ["Score SB"]: number;
  ["Score RD"]: number;
  ["Risk Profile"]: RiskProfile;
  ["Customer Name"]: string;
}
