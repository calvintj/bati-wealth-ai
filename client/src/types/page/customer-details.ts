export interface Activity {
  title: string;
  description: string;
  date: string;
}

export interface Portfolio {
  asset_type: string;
  allocation: number;
}

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
  total_fum?: string | number;
  total_aum?: string | number;
  total_fbi?: string | number;
}
