import db from "../config/db";

export interface MarketWatchlist {
  id: number;
  rm_number: string;
  watchlist_name: string;
  indices: string[]; // Array of index names like ['SPX', 'NDX', 'LQ45']
  created_at: Date;
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
  created_at: Date;
  updated_at: Date;
}

export interface MarketNoteResponse {
  notes: MarketNote[];
}

// Market Watchlists CRUD
const getWatchlists = async (
  rm_number: string
): Promise<MarketWatchlistResponse> => {
  const result = await db.query(
    `
      SELECT id, rm_number, watchlist_name, indices, created_at 
      FROM market_watchlists
      WHERE rm_number = $1
      ORDER BY created_at DESC
    `,
    [rm_number]
  );
  return {
    watchlists: result.rows.map((row) => ({
      ...row,
      indices: Array.isArray(row.indices)
        ? row.indices
        : JSON.parse(row.indices || "[]"),
    })),
  };
};

const createWatchlist = async (
  rm_number: string,
  watchlist_name: string,
  indices: string[]
): Promise<MarketWatchlistResponse> => {
  const result = await db.query(
    `
      INSERT INTO market_watchlists (rm_number, watchlist_name, indices)
      VALUES ($1, $2, $3)
      RETURNING *
    `,
    [rm_number, watchlist_name, JSON.stringify(indices)]
  );
  return {
    watchlists: [
      {
        ...result.rows[0],
        indices: Array.isArray(result.rows[0].indices)
          ? result.rows[0].indices
          : JSON.parse(result.rows[0].indices || "[]"),
      },
    ],
  };
};

const updateWatchlist = async (
  id: number,
  watchlist_name: string,
  indices: string[]
): Promise<MarketWatchlistResponse> => {
  const result = await db.query(
    `
      UPDATE market_watchlists 
      SET watchlist_name = $1, indices = $2
      WHERE id = $3
      RETURNING *
    `,
    [watchlist_name, JSON.stringify(indices), id]
  );
  return {
    watchlists: [
      {
        ...result.rows[0],
        indices: Array.isArray(result.rows[0].indices)
          ? result.rows[0].indices
          : JSON.parse(result.rows[0].indices || "[]"),
      },
    ],
  };
};

const deleteWatchlist = async (
  id: number
): Promise<MarketWatchlistResponse> => {
  const result = await db.query(
    `
      DELETE FROM market_watchlists WHERE id = $1 RETURNING *
    `,
    [id]
  );
  return {
    watchlists: result.rows.map((row) => ({
      ...row,
      indices: Array.isArray(row.indices)
        ? row.indices
        : JSON.parse(row.indices || "[]"),
    })),
  };
};

// Market Notes CRUD
const getNotes = async (
  rm_number: string,
  index_name?: string
): Promise<MarketNoteResponse> => {
  let query = `
    SELECT id, rm_number, index_name, note_title, note_content, created_at, updated_at
    FROM market_notes
    WHERE rm_number = $1
  `;
  const params: any[] = [rm_number];

  if (index_name) {
    query += ` AND index_name = $2`;
    params.push(index_name);
  }

  query += ` ORDER BY created_at DESC`;

  const result = await db.query(query, params);
  return {
    notes: result.rows,
  };
};

const createNote = async (
  rm_number: string,
  index_name: string,
  note_title: string,
  note_content: string
): Promise<MarketNoteResponse> => {
  const result = await db.query(
    `
      INSERT INTO market_notes (rm_number, index_name, note_title, note_content)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `,
    [rm_number, index_name, note_title, note_content]
  );
  return {
    notes: [result.rows[0]],
  };
};

const updateNote = async (
  id: number,
  note_title: string,
  note_content: string
): Promise<MarketNoteResponse> => {
  const result = await db.query(
    `
      UPDATE market_notes 
      SET note_title = $1, note_content = $2, updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING *
    `,
    [note_title, note_content, id]
  );
  return {
    notes: [result.rows[0]],
  };
};

const deleteNote = async (id: number): Promise<MarketNoteResponse> => {
  const result = await db.query(
    `
      DELETE FROM market_notes WHERE id = $1 RETURNING *
    `,
    [id]
  );
  return {
    notes: result.rows.length > 0 ? [result.rows[0]] : [],
  };
};

export {
  getWatchlists,
  createWatchlist,
  updateWatchlist,
  deleteWatchlist,
  getNotes,
  createNote,
  updateNote,
  deleteNote,
};
