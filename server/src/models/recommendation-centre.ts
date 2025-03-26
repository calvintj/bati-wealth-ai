import db from "../config/db";
import {
  TaskResponse,
  ManagedNumbersResponse,
  IncreasedNumbersResponse,
  PortfolioResponse,
  LastTransactionResponse,
  PotentialTransactionResponse,
  OfferProductRiskResponse,
  ReProfileRiskTargetResponse,
} from "../types/task-manager";

const getTask = async (rm_number: string): Promise<TaskResponse> => {
  const result = await db.query(
    `
      SELECT id, description, invitee, due_date FROM rm_task_manager
      WHERE rm_number = $1
    `,
    [rm_number]
  );
  return {
    task: result.rows,
  };
};

const postTask = async (
  description: string,
  invitee: string,
  due_date: string,
  rm_number: string
): Promise<TaskResponse> => {
  const result = await db.query(
    `
        INSERT INTO rm_task_manager (description, due_date, invitee, rm_number)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `,
    [description, due_date, invitee, rm_number]
  );
  return {
    task: [result.rows[0]],
  };
};

const deleteTask = async (id: string): Promise<TaskResponse> => {
  const result = await db.query(
    `
    DELETE FROM rm_task_manager WHERE id = $1
    `,
    [id]
  );
  return {
    task: [result.rows[0]],
  };
};

const updateTask = async (task: any): Promise<TaskResponse> => {
  const result = await db.query(
    `
    UPDATE rm_task_manager SET description = $1, due_date = $2, invitee = $3 WHERE id = $4
    `,
    [task.description, task.due_date, task.invitee, task.id]
  );
  return {
    task: [result.rows[0]],
  };
};

const getManagedNumbers = async (
  rm_number: string
): Promise<ManagedNumbersResponse> => {
  const result = await db.query(
    `
SELECT 
    ra.rm_number,
    COUNT(DISTINCT CASE WHEN ci.risk_profile != '0' THEN ci.bp_number_wm_core END) AS all_customers,
    SUM(CASE WHEN ci.risk_profile != '0' THEN ca.aum ELSE 0 END) AS all_aum,
    SUM(CASE WHEN ci.risk_profile IS NOT NULL
	        THEN (ca.fbi_rd + ca.fbi_sb + ca.fbi_bac)ELSE 0 END) AS all_fbi
    FROM rm_account AS ra
    JOIN customer_info AS ci ON ci.assigned_rm = ra.rm_number
	RIGHT JOIN current_allocation AS ca ON ca.bp_number_wm_core = ci.bp_number_wm_core

    WHERE ra.rm_number = $1
    GROUP BY ra.rm_number  `,
    [rm_number]
  );
  return result.rows[0];
};

const getIncreasedNumbers = async (
  rm_number: string
): Promise<IncreasedNumbersResponse> => {
  const result = await db.query(
    `
  WITH LastQuarters AS (
      SELECT 
          year,
          quarter,
          ROW_NUMBER() OVER (
              ORDER BY year DESC, quarter DESC
          ) AS rn
      FROM (SELECT DISTINCT year, quarter FROM current_allocation) AS q
  )
  SELECT 
      ra.rm_number,
      lq.year,
      lq.quarter AS quarter,
      COUNT(DISTINCT CASE WHEN ci.risk_profile != '0' THEN ci.bp_number_wm_core END) AS all_customers,
      SUM(CASE WHEN ci.risk_profile != '0' THEN ca.aum ELSE 0 END) AS all_aum,
      SUM(CASE WHEN ci.risk_profile IS NOT NULL THEN (ca.fbi_rd + ca.fbi_sb + ca.fbi_bac) ELSE 0 END) AS all_fbi
  FROM rm_account AS ra
  JOIN customer_info AS ci 
      ON ci.assigned_rm = ra.rm_number
  RIGHT JOIN current_allocation AS ca 
      ON ca.bp_number_wm_core = ci.bp_number_wm_core
  JOIN LastQuarters lq 
      ON ca.year = lq.year AND ca.quarter = lq.quarter
  WHERE ra.rm_number = $1
    AND lq.rn <= 2
  GROUP BY ra.rm_number, lq.year, lq.quarter
  ORDER BY lq.quarter DESC;
    `,
    [rm_number]
  );

  // Destructure the rows—if there are less than 2 rows, assign null.
  const [currentQuarter, lastQuarter] = result.rows;
  return {
    currentQuarter: currentQuarter || null,
    lastQuarter: lastQuarter || null,
  };
};

const getPortfolio = async (rm_number: string): Promise<PortfolioResponse> => {
  const result = await db.query(
    `
  SELECT 
  SUM(ca.casa) AS casa,
  SUM(ca.sb) AS sb,
  SUM(ca.deposito) AS deposito,
  SUM(ca.rd) AS rd
FROM current_allocation ca
JOIN customer_info ci ON ca.bp_number_wm_core = ci.bp_number_wm_core
WHERE ci.assigned_rm = $1
GROUP BY ci.assigned_rm
    `,
    [rm_number]
  );
  return {
    portfolio: result.rows,
  };
};

const getLastTransaction = async (
  rm_number: string
): Promise<LastTransactionResponse> => {
  const result = await db.query(
    `
  SELECT ht.bp_number_wm_core, ht.transaction_id, ht.jumlah_amount
FROM historical_transaction ht 
JOIN customer_info ci ON ht.bp_number_wm_core = ci.bp_number_wm_core
WHERE ci.assigned_rm = $1
LIMIT 5;
  `,
    [rm_number]
  );
  return {
    last_transaction: result.rows,
  };
};

const getPotentialTransaction = async (
  rm_number: string
): Promise<PotentialTransactionResponse> => {
  const result = await db.query(
    `
      SELECT ht.bp_number_wm_core AS id_nasabah, ht.nama_produk, ht.profit
  FROM historical_transaction ht
  JOIN customer_info ci ON ht.bp_number_wm_core = ci.bp_number_wm_core
  WHERE ci.assigned_rm = $1
  ORDER BY transaction_id DESC 
    `,
    [rm_number]
  );
  return {
    potential_transaction: result.rows,
  };
};

const getOfferProductRisk = async (
  rm_number: string
): Promise<OfferProductRiskResponse> => {
  const result = await db.query(
    `
    SELECT cs.bp_number_wm_core, cs.risk_profile, cs.offer_product_risk_1 , cs.offer_product_risk_2 , cs.offer_product_risk_3, cs.offer_product_risk_4, cs.offer_product_risk_5
FROM customer_segmentation_offer cs
JOIN customer_info ci ON cs.bp_number_wm_core = ci.bp_number_wm_core
WHERE ci.assigned_rm = $1
ORDER BY CAST(ci.bp_number_wm_core AS INTEGER) ASC
  `,
    [rm_number]
  );
  return {
    offer_product_risk: result.rows,
  };
};

const getReProfileRiskTarget = async (
  rm_number: string
): Promise<ReProfileRiskTargetResponse> => {
  const result = await db.query(
    `
    SELECT cs.bp_number_wm_core, cs.risk_profile, cs.offer_reprofile_risk_target
FROM customer_segmentation_offer cs
JOIN customer_info ci ON cs.bp_number_wm_core = ci.bp_number_wm_core
WHERE ci.assigned_rm = $1 AND cs.offer_reprofile_risk_target != '0'
ORDER BY CAST(ci.bp_number_wm_core AS INTEGER) ASC
  `,
    [rm_number]
  );
  return {
    reprofile_risk_target: result.rows,
  };
};

export {
  getManagedNumbers,
  getIncreasedNumbers,
  getPortfolio,
  getLastTransaction,
  getPotentialTransaction,
  getTask,
  postTask,
  getOfferProductRisk,
  getReProfileRiskTarget,
  deleteTask,
  updateTask,
};
