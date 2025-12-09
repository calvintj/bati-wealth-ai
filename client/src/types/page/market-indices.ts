export interface MarketWatchlist {
  id: number;
  rm_number: string;
  watchlist_name: string;
  indices: string[]; // Array of index names: ['SPX', 'NDX', 'LQ45', etc.]
  created_at: string;
}

export interface MarketWatchlistResponse {
  watchlists: MarketWatchlist[];
}

export interface MarketNote {
  id: number;
  rm_number: string;
  index_name: string; // 'SPX', 'NDX', 'DJI', 'LQ45', 'Composite', or 'general'
  note_title: string;
  note_content: string;
  created_at: string;
  updated_at: string;
}

export interface MarketNoteResponse {
  notes: MarketNote[];
}

export const INDEX_OPTIONS = [
  { value: 'SPX', label: 'S&P 500 (SPX)' },
  { value: 'NDX', label: 'NASDAQ (NDX)' },
  { value: 'DJI', label: 'Dow Jones (DJI)' },
  { value: 'LQ45', label: 'LQ45' },
  { value: 'Composite', label: 'Composite Index' },
  { value: 'general', label: 'General Market Notes' },
] as const;


