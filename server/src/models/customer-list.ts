import db from "../config/db";

const getCustomerList = async (rm_number: string) => {
  const result = await db.query(`SELECT 
    ci.bp_number_wm_core AS "Customer ID",
    ci.risk_profile AS "Risk Profile",
    ci.aum_label AS "AUM Label",
    ci.propensity AS "Propensity",
    ci.priority_private AS "Priority / Private",
    ci.customer_type AS "Customer Type",
    ci.pekerjaan AS "Pekerjaan",
    ci.status_nikah AS "Status Nikah",
    ci.usia AS "Usia",
    ci.annual_income AS "Annual Income",
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
    ci.annual_income
ORDER BY CAST(ci.bp_number_wm_core AS INTEGER) ASC;
`, [rm_number]);
  return result.rows;
};

const getCertainCustomerList = async (rm_number: string, propensity: string, aum: string) => {
  const result = await db.query(`SELECT 
    ci.bp_number_wm_core AS "Customer ID",
    ci.risk_profile AS "Risk Profile",
    ci.aum_label AS "AUM Label",
    ci.propensity AS "Propensity",
    ci.priority_private AS "Priority / Private",
    ci.customer_type AS "Customer Type",
    ci.pekerjaan AS "Pekerjaan",
    ci.status_nikah AS "Status Nikah",
    ci.usia AS "Usia",
    ci.annual_income AS "Annual Income",
    SUM(ca.fum) AS "Total FUM",
    SUM(ca.aum) AS "Total AUM",
    SUM(ca.fbi_rd + ca.fbi_sb + ca.fbi_bac) AS "Total FBI"
FROM customer_info ci
JOIN current_allocation ca ON ci.bp_number_wm_core = ca.bp_number_wm_core
JOIN rm_account ra ON ci.assigned_rm = ra.rm_number
WHERE ra.rm_number = $1 AND ci.propensity = $2 AND ci.aum_label = $3
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
    ci.annual_income
ORDER BY CAST(ci.bp_number_wm_core AS INTEGER) ASC;
`, [rm_number, propensity, aum]);
  return result.rows;
};

export { getCustomerList, getCertainCustomerList };
