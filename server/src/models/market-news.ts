import db from "../config/db";

export interface ProductPick {
  id: number;
  rm_number: string;
  ticker: string;
  pick_date: Date;
  reason?: string;
  priority: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
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
  created_at: Date;
  updated_at: Date;
}

export interface NewsNoteResponse {
  notes: NewsNote[];
}

// Product Picks CRUD
const getProductPicks = async (
  rm_number: string,
  pick_date?: string
): Promise<ProductPickResponse> => {
  let query = `
    SELECT id, rm_number, ticker, pick_date, reason, priority, is_active, created_at, updated_at
    FROM product_picks
    WHERE rm_number = $1 AND is_active = true
  `;
  const params: any[] = [rm_number];

  if (pick_date) {
    query += ` AND pick_date = $2`;
    params.push(pick_date);
  } else {
    // Default to today's date
    query += ` AND pick_date = CURRENT_DATE`;
  }

  query += ` ORDER BY priority ASC, created_at DESC`;

  const result = await db.query(query, params);
  return {
    picks: result.rows.map((row) => ({
      ...row,
      pick_date: new Date(row.pick_date),
      created_at: new Date(row.created_at),
      updated_at: new Date(row.updated_at),
    })),
  };
};

const createProductPick = async (
  rm_number: string,
  ticker: string,
  pick_date: string,
  reason?: string,
  priority?: number
): Promise<ProductPick> => {
  const result = await db.query(
    `
      INSERT INTO product_picks (rm_number, ticker, pick_date, reason, priority)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, rm_number, ticker, pick_date, reason, priority, is_active, created_at, updated_at
    `,
    [rm_number, ticker, pick_date, reason || null, priority || 0]
  );

  const pick = result.rows[0];
  return {
    ...pick,
    pick_date: new Date(pick.pick_date),
    created_at: new Date(pick.created_at),
    updated_at: new Date(pick.updated_at),
  };
};

const updateProductPick = async (
  id: number,
  rm_number: string,
  ticker?: string,
  pick_date?: string,
  reason?: string,
  priority?: number,
  is_active?: boolean
): Promise<ProductPick> => {
  const updates: string[] = [];
  const params: any[] = [];
  let paramIndex = 1;

  if (ticker !== undefined) {
    updates.push(`ticker = $${paramIndex++}`);
    params.push(ticker);
  }
  if (pick_date !== undefined) {
    updates.push(`pick_date = $${paramIndex++}`);
    params.push(pick_date);
  }
  if (reason !== undefined) {
    updates.push(`reason = $${paramIndex++}`);
    params.push(reason);
  }
  if (priority !== undefined) {
    updates.push(`priority = $${paramIndex++}`);
    params.push(priority);
  }
  if (is_active !== undefined) {
    updates.push(`is_active = $${paramIndex++}`);
    params.push(is_active);
  }

  updates.push(`updated_at = CURRENT_TIMESTAMP`);

  params.push(id, rm_number);

  const result = await db.query(
    `
      UPDATE product_picks
      SET ${updates.join(", ")}
      WHERE id = $${paramIndex++} AND rm_number = $${paramIndex++}
      RETURNING id, rm_number, ticker, pick_date, reason, priority, is_active, created_at, updated_at
    `,
    params
  );

  if (result.rows.length === 0) {
    throw new Error("Product pick not found or unauthorized");
  }

  const pick = result.rows[0];
  return {
    ...pick,
    pick_date: new Date(pick.pick_date),
    created_at: new Date(pick.created_at),
    updated_at: new Date(pick.updated_at),
  };
};

const deleteProductPick = async (
  id: number,
  rm_number: string
): Promise<ProductPick> => {
  const result = await db.query(
    `
      DELETE FROM product_picks
      WHERE id = $1 AND rm_number = $2
      RETURNING id, rm_number, ticker, pick_date, reason, priority, is_active, created_at, updated_at
    `,
    [id, rm_number]
  );

  if (result.rows.length === 0) {
    throw new Error("Product pick not found or unauthorized");
  }

  const pick = result.rows[0];
  return {
    ...pick,
    pick_date: new Date(pick.pick_date),
    created_at: new Date(pick.created_at),
    updated_at: new Date(pick.updated_at),
  };
};

// News Notes CRUD
const getNewsNotes = async (
  rm_number: string,
  news_id?: number
): Promise<NewsNoteResponse> => {
  let query = `
    SELECT id, rm_number, news_id, note_title, note_content, relevance_tags, created_at, updated_at
    FROM news_notes
    WHERE rm_number = $1
  `;
  const params: any[] = [rm_number];

  if (news_id !== undefined) {
    query += ` AND news_id = $2`;
    params.push(news_id);
  }

  query += ` ORDER BY created_at DESC`;

  const result = await db.query(query, params);
  return {
    notes: result.rows.map((row) => ({
      ...row,
      relevance_tags: row.relevance_tags || [],
      created_at: new Date(row.created_at),
      updated_at: new Date(row.updated_at),
    })),
  };
};

const createNewsNote = async (
  rm_number: string,
  note_title: string,
  note_content: string,
  news_id?: number,
  relevance_tags?: string[]
): Promise<NewsNote> => {
  const result = await db.query(
    `
      INSERT INTO news_notes (rm_number, news_id, note_title, note_content, relevance_tags)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, rm_number, news_id, note_title, note_content, relevance_tags, created_at, updated_at
    `,
    [rm_number, news_id || null, note_title, note_content, relevance_tags || []]
  );

  const note = result.rows[0];
  return {
    ...note,
    relevance_tags: note.relevance_tags || [],
    created_at: new Date(note.created_at),
    updated_at: new Date(note.updated_at),
  };
};

const updateNewsNote = async (
  id: number,
  rm_number: string,
  note_title?: string,
  note_content?: string,
  news_id?: number,
  relevance_tags?: string[]
): Promise<NewsNote> => {
  const updates: string[] = [];
  const params: any[] = [];
  let paramIndex = 1;

  if (note_title !== undefined) {
    updates.push(`note_title = $${paramIndex++}`);
    params.push(note_title);
  }
  if (note_content !== undefined) {
    updates.push(`note_content = $${paramIndex++}`);
    params.push(note_content);
  }
  if (news_id !== undefined) {
    updates.push(`news_id = $${paramIndex++}`);
    params.push(news_id);
  }
  if (relevance_tags !== undefined) {
    updates.push(`relevance_tags = $${paramIndex++}`);
    params.push(relevance_tags);
  }

  updates.push(`updated_at = CURRENT_TIMESTAMP`);

  params.push(id, rm_number);

  const result = await db.query(
    `
      UPDATE news_notes
      SET ${updates.join(", ")}
      WHERE id = $${paramIndex++} AND rm_number = $${paramIndex++}
      RETURNING id, rm_number, news_id, note_title, note_content, relevance_tags, created_at, updated_at
    `,
    params
  );

  if (result.rows.length === 0) {
    throw new Error("News note not found or unauthorized");
  }

  const note = result.rows[0];
  return {
    ...note,
    relevance_tags: note.relevance_tags || [],
    created_at: new Date(note.created_at),
    updated_at: new Date(note.updated_at),
  };
};

const deleteNewsNote = async (
  id: number,
  rm_number: string
): Promise<NewsNote> => {
  const result = await db.query(
    `
      DELETE FROM news_notes
      WHERE id = $1 AND rm_number = $2
      RETURNING id, rm_number, news_id, note_title, note_content, relevance_tags, created_at, updated_at
    `,
    [id, rm_number]
  );

  if (result.rows.length === 0) {
    throw new Error("News note not found or unauthorized");
  }

  const note = result.rows[0];
  return {
    ...note,
    relevance_tags: note.relevance_tags || [],
    created_at: new Date(note.created_at),
    updated_at: new Date(note.updated_at),
  };
};

export {
  getProductPicks,
  createProductPick,
  updateProductPick,
  deleteProductPick,
  getNewsNotes,
  createNewsNote,
  updateNewsNote,
  deleteNewsNote,
};

