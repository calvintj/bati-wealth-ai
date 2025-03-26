export interface CustomerDetails {
  bp_number_wm_core: string;
  risk_profile: string;
  aum_label: string;
  propensity: string;
  priority_private: string;
  customer_type: string;
  pekerjaan: string;
  status_nikah: string;
  usia: string;
  annual_income: string;
  tanggal_join_wealth: string;
  total_fum?: number;
  total_aum?: number;
  total_fbi?: number;
}

export interface RecommendationProduct {
  id_nasabah: string;
  nama_produk: string;
  profit: number;
  offer_risk_profile: string;
  offer_product_risk_1: string;
  offer_product_risk_2: string;
  offer_product_risk_3: string;
  offer_product_risk_4: string;
  offer_product_risk_5: string;
  offer_reprofile_risk_target: string;
}

export interface CustomerPortfolio {
  casa: number;
  sb: number;
  deposito: number;
  rd: number;
  bac: number;
}

export interface OptimizedPortfolio {
  bp_number_wm_core: string;
  asset_type: string;
  usd_allocation: number;
  assigned_rm: string;
}

export interface ReturnPercentage {
  current_return: number;
  expected_return: number;
}

export interface OwnedProduct {
  nama_produk: string;
  keterangan: string;
  jumlah_amount: number;
  price_bought: number;
  jumlah_transaksi: number;
  profit: number;
  return_value: number;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  date: string;
}

export interface ActivityResponse {
  data: Activity[];
  error: string | null;
  loading: boolean;
}

export interface QuarterlyAUM {
  bp_number_wm_core: string;
  year: number;
  quarter: number;
  rd: number;
  sb: number;
  bac: number;
  total_aum: number;
}

export interface QuarterlyFUM {
  bp_number_wm_core: string;
  year: number;
  quarter: number;
  casa: number;
  deposito: number;
  total_fum: number;
}
