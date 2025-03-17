export interface TotalCustomer {
  all: number;
  conservative: number;
  balanced: number;
  moderate: number;
  growth: number;
  aggressive: number;
}

export interface TotalAUM {
  all: number;
  conservative: number;
  balanced: number;
  moderate: number;
  growth: number;
  aggressive: number;
}

export interface TotalFBI {
  all: number;
  conservative: number;
  balanced: number;
  moderate: number;
  growth: number;
  aggressive: number;
}

export interface QuarterlyFUM {
  year: number | string;
  quarters: {
    all: {
      q1: number;
      q2: number;
      q3: number;
      q4: number;
    };
    conservative: {
      q1: number;
      q2: number;
      q3: number;
      q4: number;
    };
    balanced: {
      q1: number;
      q2: number;
      q3: number;
      q4: number;
    };
    moderate: {
      q1: number;
      q2: number;
      q3: number;
      q4: number;
    };
    growth: {
      q1: number;
      q2: number;
      q3: number;
      q4: number;
    };
    aggressive: {
      q1: number;
      q2: number;
      q3: number;
      q4: number;
    };
  };
}

export interface QuarterlyFBI {
  year: number | string;
  quarters: {
    all: {
      q1: number;
      q2: number;
      q3: number;
      q4: number;
    };
    conservative: {
      q1: number;
      q2: number;
      q3: number;
      q4: number;
    };
    balanced: {
      q1: number;
      q2: number;
      q3: number;
      q4: number;
    };
    moderate: {
      q1: number;
      q2: number;
      q3: number;
      q4: number;
    };
    growth: {
      q1: number;
      q2: number;
      q3: number;
      q4: number;
    };
    aggressive: {
      q1: number;
      q2: number;
      q3: number;
      q4: number;
    };
  };
}

export interface TopProduct {
  product: string;
  amount: number;
  category: "All" | "Conservative" | "Balanced" | "Moderate" | "Growth" | "Aggressive";
}

export interface TopProductsResult {
  all: TopProduct[];
  conservative: TopProduct[];
  balanced: TopProduct[];
  moderate: TopProduct[];
  growth: TopProduct[];
  aggressive: TopProduct[];
}

export interface CertainCustomerList {
  "Customer ID": string;
  "Risk Profile": string;
  "AUM Label": string;
  "Propensity": string;
  "Priority / Private": string;
  "Customer Type": string;
  "Pekerjaan": string;
  "Status Nikah": string;
  "Usia": number;
  "Annual Income": number;
  "Total FUM": number;
  "Total AUM": number;
  "Total FBI": number;
}
