import db from "../config/db";

const getCustomerIDList = async (rm_number: string) => {
  const result = await db.query(
    `
      SELECT 
      bp_number_wm_core
      FROM customer_info 
      WHERE assigned_rm = $1
      ORDER BY CAST(bp_number_wm_core AS INTEGER) ASC;
    `,
    [rm_number]
  );
  return result.rows;
};

const getCustomerDetails = async (rm_number: string, customerID: string) => {
  const result = await db.query(
    `
      SELECT 
        ci.bp_number_wm_core AS "ID",
        ci.risk_profile AS "Risk_Profile",
        ci.aum_label AS "AUM_Label",
        ci.propensity AS "Propensity",
        ci.priority_private AS "Priority_Private",
        ci.customer_type AS "Customer_Type",
        ci.pekerjaan AS "Pekerjaan",
        ci.status_nikah AS "Status_Nikah",
        ci.usia AS "Usia",
        ci.annual_income AS "Annual_Income",
        EXTRACT(YEAR FROM AGE(CURRENT_DATE, ci.tanggal_join_wealth)) AS "Vintage",
        SUM(ca.fum) AS "Total_FUM",
        SUM(ca.aum) AS "Total_AUM",
        SUM(ca.fbi_rd + ca.fbi_sb + ca.fbi_bac) AS "Total_FBI"
      FROM customer_info ci
      JOIN current_allocation ca ON ci.bp_number_wm_core = ca.bp_number_wm_core
      JOIN rm_account ra ON ci.assigned_rm = ra.rm_number
      WHERE ra.rm_number = $1 AND ci.bp_number_wm_core = $2
      GROUP BY 
        ci.bp_number_wm_core,
        ci.risk_profile,
        ci.aum_label,
        ci.propensity,
        ci.priority_private,
        ci.customer_type,
        ci.pekerjaan,
        ci.status_nikah,
        ci.usia,
        ci.annual_income,
        ci.tanggal_join_wealth
      ORDER BY ci.bp_number_wm_core ASC;
    `,
    [rm_number, customerID]
  );
  return result.rows[0];
};

const getRecommendationProduct = async (customerID: string) => {
  const result = await db.query(
    `
WITH potential_transaction AS (
  SELECT 
    ht.bp_number_wm_core AS id_nasabah, 
    ht.nama_produk, 
    ht.profit
  FROM historical_transaction ht
  ORDER BY transaction_id DESC
),
offer_product_risk AS (
  SELECT 
    cs.bp_number_wm_core, 
    cs.risk_profile, 
    cs.offer_product_risk_1, 
    cs.offer_product_risk_2, 
    cs.offer_product_risk_3, 
    cs.offer_product_risk_4, 
    cs.offer_product_risk_5
  FROM customer_segmentation_offer cs
),
reprofile_risk_target AS (
  SELECT 
    cs.bp_number_wm_core, 
    cs.risk_profile, 
    cs.offer_reprofile_risk_target
  FROM customer_segmentation_offer cs
)
SELECT 
  pt.id_nasabah,
  pt.nama_produk,
  pt.profit,
  opr.risk_profile AS offer_risk_profile,
  opr.offer_product_risk_1,
  opr.offer_product_risk_2,
  opr.offer_product_risk_3,
  opr.offer_product_risk_4,
  opr.offer_product_risk_5,
  rrt.offer_reprofile_risk_target
FROM potential_transaction pt
LEFT JOIN offer_product_risk opr ON pt.id_nasabah = opr.bp_number_wm_core
LEFT JOIN reprofile_risk_target rrt ON pt.id_nasabah = rrt.bp_number_wm_core
WHERE pt.id_nasabah = $1
LIMIT 1;
  `,
    [customerID]
  );
  return result.rows;
};

const getCustomerPortfolio = async (rm_number: string, customerID: string) => {
  const result = await db.query(
    `
SELECT ca.casa, ca.sb, ca.deposito, ca.rd, ca.bac FROM current_allocation ca
JOIN customer_info ci ON ca.bp_number_wm_core = ci.bp_number_wm_core
WHERE ca.bp_number_wm_core = $1 AND ci.assigned_rm = $2
ORDER BY ca.year DESC, ca.quarter DESC
LIMIT 1;
  `,
    [customerID, rm_number]
  );
  return result.rows;
};

const getOptimizedPortfolio = async (rm_number: string, customerID: string) => {
  const result = await db.query(
    `
SELECT oa.bp_number_wm_core, oa.asset_type, oa.usd_allocation, ci.assigned_rm
FROM optimized_allocation oa
JOIN customer_info ci ON oa.bp_number_wm_core = ci.bp_number_wm_core
WHERE ci.assigned_rm = $1 
  AND oa.bp_number_wm_core = $2
ORDER BY oa.bp_number_wm_core ASC;
  `,
    [rm_number, customerID]
  );
  return result.rows;
};

const getReturnPercentage = async (customerID: string) => {
  const result = await db.query(
    `
SELECT SUM(current_expected_return) AS current_return, SUM(expected_return) AS expected_return
FROM optimized_allocation
WHERE bp_number_wm_core = $1
`,
    [customerID]
  );
  return result.rows;
};

const getOwnedProduct = async (rm_number: string, customerID: string) => {
  const result = await db.query(
    `
    SELECT nama_produk, keterangan, jumlah_amount, price_bought, jumlah_transaksi, profit, return_value
FROM historical_transaction ht
JOIN customer_info ci ON ht.bp_number_wm_core = ci.bp_number_wm_core
WHERE ci.assigned_rm = $1 AND ht.bp_number_wm_core = $2
ORDER BY transaction_id DESC 
  `,
    [rm_number, customerID]
  );
  return result.rows;
};

const getQuarterlyAUM = async (customerID: string) => {
  const result = await db.query(
    `
   WITH latest_quarters AS (
    SELECT 
        bp_number_wm_core,
        year,
        quarter,
        SUM(rd) AS rd,
        SUM(sb) AS sb,
        SUM(bac) AS bac,
        SUM(rd + sb + bac) AS total_aum
    FROM 
        current_allocation
    WHERE 
        bp_number_wm_core = $1
    GROUP BY 
        bp_number_wm_core, year, quarter
    ORDER BY 
        year DESC, quarter DESC
    LIMIT 4
)
SELECT 
    bp_number_wm_core,
    year,
    quarter,
    rd,
    sb,
    bac,
    total_aum
FROM 
    latest_quarters
ORDER BY 
    year ASC, quarter ASC;

  `,
    [customerID]
  );
  return result.rows;
};

const getQuarterlyFUM = async (customerID: string) => {
  const result = await db.query(
    `
   WITH latest_quarters AS (
    SELECT 
        bp_number_wm_core,
        year,
        quarter,
        SUM(casa) AS casa,
        SUM(deposito) AS deposito,
        SUM(casa + deposito) AS total_fum
    FROM 
        current_allocation
    WHERE 
        bp_number_wm_core = $1
    GROUP BY 
        bp_number_wm_core, year, quarter
    ORDER BY 
        year DESC, quarter DESC
    LIMIT 4
)
SELECT 
    bp_number_wm_core,
    year,
    quarter,
    casa,
    deposito,
    total_fum
FROM 
    latest_quarters
ORDER BY 
    year ASC, quarter ASC;
  `,
    [customerID]
  );
  return result.rows;
};

const getActivity = async (bp_number_wm_core: string) => {
  const result = await db.query(
    `
      SELECT id, title, description, date FROM customer_activity
      WHERE bp_number_wm_core = $1
      ORDER BY date DESC
    `,
    [bp_number_wm_core]
  );
  return result.rows;
};

const postActivity = async (activity: any) => {
  const result = await db.query(
    `
        INSERT INTO customer_activity (bp_number_wm_core, title, description, date)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `,
    [
      activity.bp_number_wm_core,
      activity.title,
      activity.description,
      activity.date,
    ]
  );
  return result.rows[0];
};

const deleteActivity = async (activityID: string) => {
  const result = await db.query(
    `
    DELETE FROM customer_activity WHERE id = $1 RETURNING *
  `,
    [activityID]
  );
  return result.rows[0];
};

const updateActivity = async (activity: any) => {
  const result = await db.query(
    `
    UPDATE customer_activity SET title = $1, description = $2, date = $3 WHERE id = $4 RETURNING *
  `,
    [activity.title, activity.description, activity.date, activity.id]
  );
  return result.rows[0];
};

const updateCustomerInfo = async (
  customerID: string,
  updateData: {
    risk_profile?: string;
    aum_label?: string;
    propensity?: string;
    priority_private?: string;
    customer_type?: string;
    pekerjaan?: string;
    status_nikah?: string;
    usia?: string;
    annual_income?: string;
    assigned_rm?: string;
  }
): Promise<any> => {
  const fields: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  if (updateData.risk_profile !== undefined) {
    fields.push(`risk_profile = $${paramIndex}`);
    values.push(updateData.risk_profile);
    paramIndex++;
  }
  if (updateData.aum_label !== undefined) {
    fields.push(`aum_label = $${paramIndex}`);
    values.push(updateData.aum_label);
    paramIndex++;
  }
  if (updateData.propensity !== undefined) {
    fields.push(`propensity = $${paramIndex}`);
    values.push(updateData.propensity);
    paramIndex++;
  }
  if (updateData.priority_private !== undefined) {
    fields.push(`priority_private = $${paramIndex}`);
    values.push(updateData.priority_private);
    paramIndex++;
  }
  if (updateData.customer_type !== undefined) {
    fields.push(`customer_type = $${paramIndex}`);
    values.push(updateData.customer_type);
    paramIndex++;
  }
  if (updateData.pekerjaan !== undefined) {
    fields.push(`pekerjaan = $${paramIndex}`);
    values.push(updateData.pekerjaan);
    paramIndex++;
  }
  if (updateData.status_nikah !== undefined) {
    fields.push(`status_nikah = $${paramIndex}`);
    values.push(updateData.status_nikah);
    paramIndex++;
  }
  if (updateData.usia !== undefined) {
    fields.push(`usia = $${paramIndex}`);
    values.push(updateData.usia);
    paramIndex++;
  }
  if (updateData.annual_income !== undefined) {
    fields.push(`annual_income = $${paramIndex}`);
    // Parse as float to ensure proper numeric type
    values.push(
      updateData.annual_income ? parseFloat(updateData.annual_income) : null
    );
    paramIndex++;
  }
  if (updateData.assigned_rm !== undefined) {
    fields.push(`assigned_rm = $${paramIndex}`);
    values.push(updateData.assigned_rm);
    paramIndex++;
  }

  if (fields.length === 0) {
    throw new Error("No fields to update");
  }

  values.push(customerID);
  const query = `
    UPDATE customer_info 
    SET ${fields.join(", ")}
    WHERE bp_number_wm_core = $${paramIndex}
    RETURNING *
  `;

  const result = await db.query(query, values);
  return result.rows[0];
};

const bulkUpdateCustomers = async (
  customerIDs: string[],
  updateData: {
    risk_profile?: string;
    aum_label?: string;
    propensity?: string;
    priority_private?: string;
    customer_type?: string;
    pekerjaan?: string;
    status_nikah?: string;
    usia?: string;
    annual_income?: string;
    assigned_rm?: string;
  }
): Promise<{ updated: number; failed: number; errors: string[] }> => {
  const fields: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  if (updateData.risk_profile !== undefined && updateData.risk_profile !== "") {
    fields.push(`risk_profile = $${paramIndex}::text`);
    values.push(String(updateData.risk_profile));
    paramIndex++;
  }
  if (updateData.aum_label !== undefined && updateData.aum_label !== "") {
    fields.push(`aum_label = $${paramIndex}::text`);
    values.push(String(updateData.aum_label));
    paramIndex++;
  }
  if (updateData.propensity !== undefined && updateData.propensity !== "") {
    fields.push(`propensity = $${paramIndex}::text`);
    values.push(String(updateData.propensity));
    paramIndex++;
  }
  if (
    updateData.priority_private !== undefined &&
    updateData.priority_private !== ""
  ) {
    fields.push(`priority_private = $${paramIndex}::text`);
    values.push(String(updateData.priority_private));
    paramIndex++;
  }
  if (
    updateData.customer_type !== undefined &&
    updateData.customer_type !== ""
  ) {
    fields.push(`customer_type = $${paramIndex}::text`);
    values.push(String(updateData.customer_type));
    paramIndex++;
  }
  if (updateData.pekerjaan !== undefined && updateData.pekerjaan !== "") {
    fields.push(`pekerjaan = $${paramIndex}::text`);
    values.push(String(updateData.pekerjaan));
    paramIndex++;
  }
  if (updateData.status_nikah !== undefined && updateData.status_nikah !== "") {
    fields.push(`status_nikah = $${paramIndex}::text`);
    values.push(String(updateData.status_nikah));
    paramIndex++;
  }
  if (updateData.usia !== undefined && updateData.usia !== "") {
    fields.push(`usia = $${paramIndex}::integer`);
    const parsedUsia = parseInt(updateData.usia, 10);
    if (isNaN(parsedUsia)) {
      throw new Error("Age (usia) must be a valid number");
    }
    values.push(parsedUsia);
    paramIndex++;
  }
  if (
    updateData.annual_income !== undefined &&
    updateData.annual_income !== ""
  ) {
    fields.push(`annual_income = $${paramIndex}::numeric`);
    // Parse as float to ensure proper numeric type
    const parsedValue = parseFloat(updateData.annual_income);
    if (isNaN(parsedValue)) {
      throw new Error("Annual income must be a valid number");
    }
    values.push(parsedValue);
    paramIndex++;
  }
  if (updateData.assigned_rm !== undefined && updateData.assigned_rm !== "") {
    fields.push(`assigned_rm = $${paramIndex}::text`);
    values.push(String(updateData.assigned_rm));
    paramIndex++;
  }

  if (fields.length === 0) {
    throw new Error("No fields to update");
  }

  if (customerIDs.length === 0) {
    throw new Error("No customers selected");
  }

  // Create placeholders for customer IDs
  // paramIndex is already the next available index, so use it directly
  const idPlaceholders = customerIDs
    .map((_, index) => `$${paramIndex + index}`)
    .join(", ");
  // Ensure customer IDs are strings (bp_number_wm_core is stored as text)
  values.push(...customerIDs.map((id) => String(id)));

  const query = `
    UPDATE customer_info 
    SET ${fields.join(", ")}
    WHERE bp_number_wm_core IN (${idPlaceholders})
    RETURNING bp_number_wm_core
  `;

  try {
    console.log("Bulk update query:", query);
    console.log("Bulk update values:", values);
    const result = await db.query(query, values);
    return {
      updated: result.rows.length,
      failed: customerIDs.length - result.rows.length,
      errors: [],
    };
  } catch (error: any) {
    console.error("Bulk update database error:", error);
    throw new Error(`Bulk update failed: ${error.message}`);
  }
};

export {
  getCustomerIDList,
  getCustomerDetails,
  getRecommendationProduct,
  getCustomerPortfolio,
  getOptimizedPortfolio,
  getReturnPercentage,
  getOwnedProduct,
  getActivity,
  postActivity,
  deleteActivity,
  updateActivity,
  getQuarterlyAUM,
  getQuarterlyFUM,
  updateCustomerInfo,
  bulkUpdateCustomers,
};
