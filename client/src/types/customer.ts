export type Status = "NONE" | "HIGH" | "MEDIUM" | "LOW";
export type AUMLabel = Status;
export type PropensityBAC = Status;
export type PropensitySB = Status;
export type PropensityRD = Status;
export type TransactionLabel = Status;
export type PrioStatus = "PRIORITY" | "PRIVATE";

export interface Customer {
  id: number;
  name: string;
  assignedRM: string;
  type: string;
  prioStatus: PrioStatus;
  transactionLabel: TransactionLabel;
  aUMLabel: AUMLabel;
  propensityBAC: PropensityBAC;
  propensitySB: PropensitySB;
  propensityRD: PropensityRD;
  scoreOverall: number;
}
