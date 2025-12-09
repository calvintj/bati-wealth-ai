export interface ProductPick {
  id: number;
  rm_number: string;
  ticker: string;
  pick_date: string;
  reason?: string;
  priority: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductPickResponse {
  picks: ProductPick[];
}

export interface NewsNote {
  id: number;
  rm_number: string;
  news_id?: number;
  note_title: string;
  note_content: string;
  relevance_tags?: string[];
  created_at: string;
  updated_at: string;
}

export interface NewsNoteResponse {
  notes: NewsNote[];
}

