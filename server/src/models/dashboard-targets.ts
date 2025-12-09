import db from "../config/db";

export interface DashboardTarget {
  id: number;
  rm_number: string;
  metric_type: "customers" | "aum" | "fbi";
  target_value: number;
  target_date: Date | null;
  notes: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface CreateTargetData {
  rm_number: string;
  metric_type: "customers" | "aum" | "fbi";
  target_value: number;
  target_date?: Date | null;
  notes?: string | null;
}

export interface UpdateTargetData {
  target_value?: number;
  target_date?: Date | null;
  notes?: string | null;
}

// Get all targets for an RM
export const getTargets = async (rm_number: string): Promise<DashboardTarget[]> => {
  const result = await db.query(
    `SELECT * FROM dashboard_targets WHERE rm_number = $1 ORDER BY metric_type`,
    [rm_number]
  );
  return result.rows;
};

// Get a specific target
export const getTarget = async (
  rm_number: string,
  metric_type: "customers" | "aum" | "fbi"
): Promise<DashboardTarget | null> => {
  const result = await db.query(
    `SELECT * FROM dashboard_targets WHERE rm_number = $1 AND metric_type = $2`,
    [rm_number, metric_type]
  );
  return result.rows[0] || null;
};

// Create or update target (upsert)
export const upsertTarget = async (data: CreateTargetData): Promise<DashboardTarget> => {
  const result = await db.query(
    `INSERT INTO dashboard_targets (rm_number, metric_type, target_value, target_date, notes)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (rm_number, metric_type)
     DO UPDATE SET
       target_value = EXCLUDED.target_value,
       target_date = EXCLUDED.target_date,
       notes = EXCLUDED.notes,
       updated_at = CURRENT_TIMESTAMP
     RETURNING *`,
    [data.rm_number, data.metric_type, data.target_value, data.target_date || null, data.notes || null]
  );
  return result.rows[0];
};

// Update target
export const updateTarget = async (
  rm_number: string,
  metric_type: "customers" | "aum" | "fbi",
  data: UpdateTargetData
): Promise<DashboardTarget> => {
  const fields: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  if (data.target_value !== undefined) {
    fields.push(`target_value = $${paramIndex}`);
    values.push(data.target_value);
    paramIndex++;
  }
  if (data.target_date !== undefined) {
    fields.push(`target_date = $${paramIndex}`);
    values.push(data.target_date);
    paramIndex++;
  }
  if (data.notes !== undefined) {
    fields.push(`notes = $${paramIndex}`);
    values.push(data.notes);
    paramIndex++;
  }

  if (fields.length === 0) {
    throw new Error("No fields to update");
  }

  fields.push(`updated_at = CURRENT_TIMESTAMP`);
  values.push(rm_number, metric_type);

  const query = `
    UPDATE dashboard_targets
    SET ${fields.join(", ")}
    WHERE rm_number = $${paramIndex} AND metric_type = $${paramIndex + 1}
    RETURNING *
  `;

  const result = await db.query(query, values);
  if (result.rows.length === 0) {
    throw new Error("Target not found");
  }
  return result.rows[0];
};

// Delete target
export const deleteTarget = async (
  rm_number: string,
  metric_type: "customers" | "aum" | "fbi"
): Promise<void> => {
  await db.query(
    `DELETE FROM dashboard_targets WHERE rm_number = $1 AND metric_type = $2`,
    [rm_number, metric_type]
  );
};


