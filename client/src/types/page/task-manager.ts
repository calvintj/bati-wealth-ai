export interface TaskRow {
  id: string;
  description: string;
  invitee: string;
  due_date: string;
}

export interface TaskResponse {
  task: TaskRow[];
}

export interface ManagedNumbersResponse {
  rm_number: string;
  all_customers: number;
  all_aum: number;
  all_fbi: number;
}

export interface IncreasedNumbersRow {
  rm_number: string;
  year: number;
  quarter: number;
  all_customers: number;
  all_aum: number;
  all_fbi: number;
}

export interface IncreasedNumbersResponse {
  currentQuarter: IncreasedNumbersRow | null;
  lastQuarter: IncreasedNumbersRow | null;
}

export interface PortfolioRow {
  rm_number: string;
  casa: number;
  sb: number;
  deposito: number;
  rd: number;
}

export interface PortfolioResponse {
  portfolio: PortfolioRow[];
}

export interface LastTransactionRow {
  bp_number_wm_core: string;
  transaction_id: string;
  jumlah_amount: number;
}

export interface LastTransactionResponse {
  last_transaction: LastTransactionRow[];
}

export interface PotentialTransactionRow {
  id_nasabah: string;
  nama_produk: string;
  profit: number;
}

export interface PotentialTransactionResponse {
  potential_transaction: PotentialTransactionRow[];
}

export interface OfferProductRiskRow {
  bp_number_wm_core: string;
  risk_profile: string;
  offer_product_risk_1: string;
  offer_product_risk_2: string;
  offer_product_risk_3: string;
  offer_product_risk_4: string;
  offer_product_risk_5: string;
}

export interface OfferProductRiskResponse {
  offer_product_risk: OfferProductRiskRow[];
}

export interface ReProfileRiskTargetRow {
  bp_number_wm_core: string;
  risk_profile: string;
  offer_reprofile_risk_target: string;
}

export interface ReProfileRiskTargetResponse {
  reprofile_risk_target: ReProfileRiskTargetRow[];
}
