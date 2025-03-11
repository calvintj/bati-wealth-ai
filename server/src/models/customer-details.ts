import db from "../config/db";

const getCustomerIDList = async (rm_number: string) => {
  const result = await db.query(`
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
        SUM(ca.fum) AS "Total FUM",
        SUM(ca.aum) AS "Total AUM",
        SUM(ca.fbi_rd + ca.fbi_sb + ca.fbi_bac) AS "Total FBI"
      FROM customer_info ci
      JOIN current_allocation ca ON ci.bp_number_wm_core = ca.bp_number_wm_core
      JOIN rm_account ra ON ci.assigned_rm = ra.rm_number
      WHERE ra.rm_number = $1
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
      ORDER BY CAST(ci.bp_number_wm_core AS INTEGER) ASC;
    `, [rm_number]);
  return result.rows;
};

const getCustomerDetails = async (rm_number: string, customerID: string) => {
  const result = await db.query(`
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
    `, [rm_number, customerID]);
  return result.rows[0];
};

const getRecommendationProduct = async (customerID: string) => {
  const result = await db.query(`
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
  `, [customerID]);
  return result.rows;
};

const getCustomerPortfolio = async (rm_number: string, customerID: string) => {
  const result = await db.query(`
SELECT ca.casa, ca.sb, ca.deposito, ca.rd FROM current_allocation ca
JOIN customer_info ci ON ca.bp_number_wm_core = ci.bp_number_wm_core
WHERE ca.bp_number_wm_core = $1 AND ci.assigned_rm = $2
ORDER BY ca.year DESC, ca.quarter DESC
LIMIT 1;
  `, [customerID, rm_number]);
  return result.rows;
};

const getOptimizedPortfolio = async (rm_number: string, customerID: string) => {
  const result = await db.query(`
SELECT oa.bp_number_wm_core, oa.asset_type, oa.recommended_allocation, ci.assigned_rm
FROM optimized_allocation oa
JOIN customer_info ci ON oa.bp_number_wm_core = ci.bp_number_wm_core
WHERE ci.assigned_rm = $1 
  AND oa.bp_number_wm_core = $2
ORDER BY oa.bp_number_wm_core ASC;
  `, [rm_number, customerID]);
  return result.rows;
};

const getReturnPercentage = async (customerID: string) => {
  const result = await db.query(`
SELECT SUM(current_expected_return) AS current_return, SUM(expected_return) AS expected_return
FROM optimized_allocation
WHERE bp_number_wm_core = $1
`, [customerID]);
  return result.rows;
};

const getOwnedProduct = async (rm_number: string, customerID: string) => {
  const result = await db.query(`
    SELECT nama_produk, keterangan, jumlah_amount, price_bought, jumlah_transaksi, profit, return_value
FROM historical_transaction ht
JOIN customer_info ci ON ht.bp_number_wm_core = ci.bp_number_wm_core
WHERE ci.assigned_rm = $1 AND ht.bp_number_wm_core = $2
ORDER BY transaction_id DESC 
  `, [rm_number, customerID]);
  return result.rows;
};

const getActivity = async (bp_number_wm_core: string) => {
  const result = await db.query(`
      SELECT title, description, date FROM customer_activity
      WHERE bp_number_wm_core = $1
    `, [bp_number_wm_core]);
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
};
