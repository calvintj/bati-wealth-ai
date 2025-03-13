export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  [key: string]: string | number | undefined;
}

export interface CustomerRecord {
  [key: string]: string | number | undefined;
  "Customer ID"?: string;
  "Risk Profile"?: string;
  "AUM Label"?: string;
  Propensity?: string;
  "Priority / Private"?: string;
  "Customer Type"?: string;
  Pekerjaan?: string;
  "Status Nikah"?: string;
  Usia?: number;
  "Annual Income"?: number;
  "Total FUM"?: number;
  "Total AUM"?: number;
  "Total FBI"?: number;
}
