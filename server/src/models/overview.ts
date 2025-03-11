import db from "../config/db";

const getTotalCustomer = async (rm_number: string) => {
    const result = await db.query(`
      SELECT 
        ra.rm_number,
        COUNT(DISTINCT CASE WHEN ci.risk_profile != '0' THEN ci.bp_number_wm_core END) AS all,
        COUNT(DISTINCT CASE WHEN ci.risk_profile = '1 - Conservative' THEN ci.bp_number_wm_core END) AS conservative,
        COUNT(DISTINCT CASE WHEN ci.risk_profile = '2 - Balanced' THEN ci.bp_number_wm_core END) AS balanced,
        COUNT(DISTINCT CASE WHEN ci.risk_profile = '3 - Moderate' THEN ci.bp_number_wm_core END) AS moderate,
        COUNT(DISTINCT CASE WHEN ci.risk_profile = '4 - Growth' THEN ci.bp_number_wm_core END) AS growth,
        COUNT(DISTINCT CASE WHEN ci.risk_profile = '5 - Aggressive' THEN ci.bp_number_wm_core END) AS aggressive
      FROM rm_account AS ra
      JOIN customer_info AS ci ON ci.assigned_rm = ra.rm_number
      WHERE ra.rm_number = $1
      GROUP BY ra.rm_number
    `, [rm_number]);

    return {
      all: parseInt(result.rows[0]?.all || 0, 10),
      conservative: parseInt(result.rows[0]?.conservative || 0, 10),
      balanced: parseInt(result.rows[0]?.balanced || 0, 10),
      moderate: parseInt(result.rows[0]?.moderate || 0, 10),
      growth: parseInt(result.rows[0]?.growth || 0, 10),
      aggressive: parseInt(result.rows[0]?.aggressive || 0, 10),
    };
};

const getTotalAUM = async (rm_number: string) => {
    const result = await db.query(`
      SELECT 
        ra.rm_number,
        SUM(CASE WHEN ci.risk_profile != '0' THEN ca.aum ELSE 0 END) AS all_aum,
        SUM(CASE WHEN ci.risk_profile = '1 - Conservative' THEN ca.aum ELSE 0 END) AS conservative_aum,
        SUM(CASE WHEN ci.risk_profile = '2 - Balanced' THEN ca.aum ELSE 0 END) AS balanced_aum,
        SUM(CASE WHEN ci.risk_profile = '3 - Moderate' THEN ca.aum ELSE 0 END) AS moderate_aum,
        SUM(CASE WHEN ci.risk_profile = '4 - Growth' THEN ca.aum ELSE 0 END) AS growth_aum,
        SUM(CASE WHEN ci.risk_profile = '5 - Aggressive' THEN ca.aum ELSE 0 END) AS aggressive_aum
      FROM rm_account AS ra
      JOIN customer_info AS ci ON ci.assigned_rm = ra.rm_number
      LEFT JOIN current_allocation AS ca ON ca.bp_number_wm_core = ci.bp_number_wm_core
      WHERE ra.rm_number = $1
      GROUP BY ra.rm_number
    `, [rm_number]);

    return {
      all: parseFloat(result.rows[0]?.all_aum || 0),
      conservative: parseFloat(result.rows[0]?.conservative_aum || 0),
      balanced: parseFloat(result.rows[0]?.balanced_aum || 0),
      moderate: parseFloat(result.rows[0]?.moderate_aum || 0),
      growth: parseFloat(result.rows[0]?.growth_aum || 0),
      aggressive: parseFloat(result.rows[0]?.aggressive_aum || 0),
    };
};

const getTotalFBI = async (rm_number: string) => {
    const result = await db.query(`
    SELECT 
      ra.rm_number,
      SUM(CASE WHEN ci.risk_profile IS NOT NULL
	            THEN (ca.fbi_rd + ca.fbi_sb + ca.fbi_bac)ELSE 0 END) AS all_fbi,
      SUM(CASE WHEN ci.risk_profile = '1 - Conservative' 
              THEN (ca.fbi_rd + ca.fbi_sb + ca.fbi_bac) ELSE 0 END) AS conservative_fbi,
      SUM(CASE WHEN ci.risk_profile = '2 - Balanced' 
              THEN (ca.fbi_rd + ca.fbi_sb + ca.fbi_bac) ELSE 0 END) AS balanced_fbi,
      SUM(CASE WHEN ci.risk_profile = '3 - Moderate' 
              THEN (ca.fbi_rd + ca.fbi_sb + ca.fbi_bac) ELSE 0 END) AS moderate_fbi,
      SUM(CASE WHEN ci.risk_profile = '4 - Growth' 
              THEN (ca.fbi_rd + ca.fbi_sb + ca.fbi_bac) ELSE 0 END) AS growth_fbi,
      SUM(CASE WHEN ci.risk_profile = '5 - Aggressive' 
              THEN (ca.fbi_rd + ca.fbi_sb + ca.fbi_bac) ELSE 0 END) AS aggressive_fbi
    FROM rm_account AS ra
    JOIN customer_info AS ci ON ci.assigned_rm = ra.rm_number
    LEFT JOIN current_allocation AS ca ON ca.bp_number_wm_core = ci.bp_number_wm_core
    WHERE ra.rm_number = $1
    GROUP BY ra.rm_number;
    `, [rm_number]);

    return {
      all: parseFloat(result.rows[0]?.all_fbi || 0),
      conservative: parseFloat(result.rows[0]?.conservative_fbi || 0),
      balanced: parseFloat(result.rows[0]?.balanced_fbi || 0),
      moderate: parseFloat(result.rows[0]?.moderate_fbi || 0),
      growth: parseFloat(result.rows[0]?.growth_fbi || 0),
      aggressive: parseFloat(result.rows[0]?.aggressive_fbi || 0),
    };
};

const getQuarterlyFUM = async (rm_number: string) => {
    const result = await db.query(`
    WITH quarterly_fum AS (
    SELECT 
        ra.rm_number,
        ca.year,
        ca.quarter,
        SUM(CASE WHEN ci.risk_profile IS NOT NULL 
            THEN ca.fum ELSE 0 END) AS all_fum,
        SUM(CASE WHEN ci.risk_profile = '1 - Conservative' 
            THEN ca.fum ELSE 0 END) AS conservative_fum,
        SUM(CASE WHEN ci.risk_profile = '2 - Balanced' 
            THEN ca.fum ELSE 0 END) AS balanced_fum,
        SUM(CASE WHEN ci.risk_profile = '3 - Moderate' 
            THEN ca.fum ELSE 0 END) AS moderate_fum,
        SUM(CASE WHEN ci.risk_profile = '4 - Growth' 
            THEN ca.fum ELSE 0 END) AS growth_fum,
        SUM(CASE WHEN ci.risk_profile = '5 - Aggressive' 
            THEN ca.fum ELSE 0 END) AS aggressive_fum
    FROM rm_account AS ra
    JOIN customer_info AS ci ON ci.assigned_rm = ra.rm_number
    LEFT JOIN current_allocation AS ca ON ca.bp_number_wm_core = ci.bp_number_wm_core
    WHERE ra.rm_number = $1
    GROUP BY ra.rm_number, ca.year, ca.quarter
    HAVING SUM(ca.fum) > 0
    ORDER BY ca.year DESC, ca.quarter DESC
    LIMIT 6
    )
    SELECT 
        rm_number,
        year,
        SUM(CASE WHEN quarter = 1 THEN all_fum ELSE 0 END) AS q1_all,
        SUM(CASE WHEN quarter = 2 THEN all_fum ELSE 0 END) AS q2_all,
        SUM(CASE WHEN quarter = 3 THEN all_fum ELSE 0 END) AS q3_all,
        SUM(CASE WHEN quarter = 4 THEN all_fum ELSE 0 END) AS q4_all,
        SUM(CASE WHEN quarter = 1 THEN conservative_fum ELSE 0 END) AS q1_conservative,
        SUM(CASE WHEN quarter = 2 THEN conservative_fum ELSE 0 END) AS q2_conservative,
        SUM(CASE WHEN quarter = 3 THEN conservative_fum ELSE 0 END) AS q3_conservative,
        SUM(CASE WHEN quarter = 4 THEN conservative_fum ELSE 0 END) AS q4_conservative,
        SUM(CASE WHEN quarter = 1 THEN balanced_fum ELSE 0 END) AS q1_balanced,
        SUM(CASE WHEN quarter = 2 THEN balanced_fum ELSE 0 END) AS q2_balanced,
        SUM(CASE WHEN quarter = 3 THEN balanced_fum ELSE 0 END) AS q3_balanced,
        SUM(CASE WHEN quarter = 4 THEN balanced_fum ELSE 0 END) AS q4_balanced,
        SUM(CASE WHEN quarter = 1 THEN moderate_fum ELSE 0 END) AS q1_moderate,
        SUM(CASE WHEN quarter = 2 THEN moderate_fum ELSE 0 END) AS q2_moderate,
        SUM(CASE WHEN quarter = 3 THEN moderate_fum ELSE 0 END) AS q3_moderate,
        SUM(CASE WHEN quarter = 4 THEN moderate_fum ELSE 0 END) AS q4_moderate,
        SUM(CASE WHEN quarter = 1 THEN growth_fum ELSE 0 END) AS q1_growth,
        SUM(CASE WHEN quarter = 2 THEN growth_fum ELSE 0 END) AS q2_growth,
        SUM(CASE WHEN quarter = 3 THEN growth_fum ELSE 0 END) AS q3_growth,
        SUM(CASE WHEN quarter = 4 THEN growth_fum ELSE 0 END) AS q4_growth,
        SUM(CASE WHEN quarter = 1 THEN aggressive_fum ELSE 0 END) AS q1_aggressive,
        SUM(CASE WHEN quarter = 2 THEN aggressive_fum ELSE 0 END) AS q2_aggressive,
        SUM(CASE WHEN quarter = 3 THEN aggressive_fum ELSE 0 END) AS q3_aggressive,
        SUM(CASE WHEN quarter = 4 THEN aggressive_fum ELSE 0 END) AS q4_aggressive
    FROM quarterly_fum
    GROUP BY rm_number, year
    ORDER BY year ASC;
    `, [rm_number]);
    return result.rows.map((row) => ({
      year: row.year,
      quarters: {
        all: {
          q1: parseFloat(row.q1_all || 0),
          q2: parseFloat(row.q2_all || 0),
          q3: parseFloat(row.q3_all || 0),
          q4: parseFloat(row.q4_all || 0),
        },
        conservative: {
          q1: parseFloat(row.q1_conservative || 0),
          q2: parseFloat(row.q2_conservative || 0),
          q3: parseFloat(row.q3_conservative || 0),
          q4: parseFloat(row.q4_conservative || 0),
        },
        balanced: {
          q1: parseFloat(row.q1_balanced || 0),
          q2: parseFloat(row.q2_balanced || 0),
          q3: parseFloat(row.q3_balanced || 0),
          q4: parseFloat(row.q4_balanced || 0),
        },
        moderate: {
          q1: parseFloat(row.q1_moderate || 0),
          q2: parseFloat(row.q2_moderate || 0),
          q3: parseFloat(row.q3_moderate || 0),
          q4: parseFloat(row.q4_moderate || 0),
        },
        growth: {
          q1: parseFloat(row.q1_growth || 0),
          q2: parseFloat(row.q2_growth || 0),
          q3: parseFloat(row.q3_growth || 0),
          q4: parseFloat(row.q4_growth || 0),
        },
        aggressive: {
          q1: parseFloat(row.q1_aggressive || 0),
          q2: parseFloat(row.q2_aggressive || 0),
          q3: parseFloat(row.q3_aggressive || 0),
          q4: parseFloat(row.q4_aggressive || 0),
        },
      },
    }));
};

const getQuarterlyFBI = async (rm_number: string) => {
    const result = await db.query(`
    WITH quarterly_fbi AS (
    SELECT 
        ra.rm_number,
        ca.year,
        ca.quarter,
        SUM(CASE WHEN ci.risk_profile IS NOT NULL 
            THEN (ca.fbi_rd + ca.fbi_sb + ca.fbi_bac) ELSE 0 END) AS all_fbi,
        SUM(CASE WHEN ci.risk_profile = '1 - Conservative' 
            THEN (ca.fbi_rd + ca.fbi_sb + ca.fbi_bac) ELSE 0 END) AS conservative_fbi,
        SUM(CASE WHEN ci.risk_profile = '2 - Balanced' 
            THEN (ca.fbi_rd + ca.fbi_sb + ca.fbi_bac) ELSE 0 END) AS balanced_fbi,
        SUM(CASE WHEN ci.risk_profile = '3 - Moderate' 
            THEN (ca.fbi_rd + ca.fbi_sb + ca.fbi_bac) ELSE 0 END) AS moderate_fbi,
        SUM(CASE WHEN ci.risk_profile = '4 - Growth' 
            THEN (ca.fbi_rd + ca.fbi_sb + ca.fbi_bac) ELSE 0 END) AS growth_fbi,
        SUM(CASE WHEN ci.risk_profile = '5 - Aggressive' 
            THEN (ca.fbi_rd + ca.fbi_sb + ca.fbi_bac) ELSE 0 END) AS aggressive_fbi
    FROM rm_account AS ra
    JOIN customer_info AS ci ON ci.assigned_rm = ra.rm_number
    LEFT JOIN current_allocation AS ca ON ca.bp_number_wm_core = ci.bp_number_wm_core
    WHERE ra.rm_number = $1
    GROUP BY ra.rm_number, ca.year, ca.quarter
    HAVING SUM(ca.fbi_rd + ca.fbi_sb + ca.fbi_bac) > 0
    ORDER BY ca.year DESC, ca.quarter DESC
    LIMIT 6
    )
    SELECT 
        rm_number,
        year,
        SUM(CASE WHEN quarter = 1 THEN all_fbi ELSE 0 END) AS q1_all,
        SUM(CASE WHEN quarter = 2 THEN all_fbi ELSE 0 END) AS q2_all,
        SUM(CASE WHEN quarter = 3 THEN all_fbi ELSE 0 END) AS q3_all,
        SUM(CASE WHEN quarter = 4 THEN all_fbi ELSE 0 END) AS q4_all,
        SUM(CASE WHEN quarter = 1 THEN conservative_fbi ELSE 0 END) AS q1_conservative,
        SUM(CASE WHEN quarter = 2 THEN conservative_fbi ELSE 0 END) AS q2_conservative,
        SUM(CASE WHEN quarter = 3 THEN conservative_fbi ELSE 0 END) AS q3_conservative,
        SUM(CASE WHEN quarter = 4 THEN conservative_fbi ELSE 0 END) AS q4_conservative,
        SUM(CASE WHEN quarter = 1 THEN balanced_fbi ELSE 0 END) AS q1_balanced,
        SUM(CASE WHEN quarter = 2 THEN balanced_fbi ELSE 0 END) AS q2_balanced,
        SUM(CASE WHEN quarter = 3 THEN balanced_fbi ELSE 0 END) AS q3_balanced,
        SUM(CASE WHEN quarter = 4 THEN balanced_fbi ELSE 0 END) AS q4_balanced,
        SUM(CASE WHEN quarter = 1 THEN moderate_fbi ELSE 0 END) AS q1_moderate,
        SUM(CASE WHEN quarter = 2 THEN moderate_fbi ELSE 0 END) AS q2_moderate,
        SUM(CASE WHEN quarter = 3 THEN moderate_fbi ELSE 0 END) AS q3_moderate,
        SUM(CASE WHEN quarter = 4 THEN moderate_fbi ELSE 0 END) AS q4_moderate,
        SUM(CASE WHEN quarter = 1 THEN growth_fbi ELSE 0 END) AS q1_growth,
        SUM(CASE WHEN quarter = 2 THEN growth_fbi ELSE 0 END) AS q2_growth,
        SUM(CASE WHEN quarter = 3 THEN growth_fbi ELSE 0 END) AS q3_growth,
        SUM(CASE WHEN quarter = 4 THEN growth_fbi ELSE 0 END) AS q4_growth,
        SUM(CASE WHEN quarter = 1 THEN aggressive_fbi ELSE 0 END) AS q1_aggressive,
        SUM(CASE WHEN quarter = 2 THEN aggressive_fbi ELSE 0 END) AS q2_aggressive,
        SUM(CASE WHEN quarter = 3 THEN aggressive_fbi ELSE 0 END) AS q3_aggressive,
        SUM(CASE WHEN quarter = 4 THEN aggressive_fbi ELSE 0 END) AS q4_aggressive
    FROM quarterly_fbi
    GROUP BY rm_number, year
    ORDER BY year ASC;
    `, [rm_number]);

    return result.rows.map((row) => ({
      year: row.year,
      quarters: {
        all: {
          q1: parseFloat(row.q1_all || 0),
          q2: parseFloat(row.q2_all || 0),
          q3: parseFloat(row.q3_all || 0),
          q4: parseFloat(row.q4_all || 0),
        },
        conservative: {
          q1: parseFloat(row.q1_conservative || 0),
          q2: parseFloat(row.q2_conservative || 0),
          q3: parseFloat(row.q3_conservative || 0),
          q4: parseFloat(row.q4_conservative || 0),
        },
        balanced: {
          q1: parseFloat(row.q1_balanced || 0),
          q2: parseFloat(row.q2_balanced || 0),
          q3: parseFloat(row.q3_balanced || 0),
          q4: parseFloat(row.q4_balanced || 0),
        },
        moderate: {
          q1: parseFloat(row.q1_moderate || 0),
          q2: parseFloat(row.q2_moderate || 0),
          q3: parseFloat(row.q3_moderate || 0),
          q4: parseFloat(row.q4_moderate || 0),
        },
        growth: {
          q1: parseFloat(row.q1_growth || 0),
          q2: parseFloat(row.q2_growth || 0),
          q3: parseFloat(row.q3_growth || 0),
          q4: parseFloat(row.q4_growth || 0),
        },
        aggressive: {
          q1: parseFloat(row.q1_aggressive || 0),
          q2: parseFloat(row.q2_aggressive || 0),
          q3: parseFloat(row.q3_aggressive || 0),
          q4: parseFloat(row.q4_aggressive || 0),
        },
      },
    }));
};

const getTopProducts = async (rm_number: string) => {
    const result = await db.query(
      `
      WITH all_products AS (
        SELECT
          ra.rm_number,
          ht.nama_produk,
          SUM(ht.jumlah_amount) AS total_amount
        FROM historical_transaction ht
        JOIN customer_info ci 
          ON ht.bp_number_wm_core = ci.bp_number_wm_core
        JOIN rm_account ra 
          ON ci.assigned_rm = ra.rm_number
        WHERE ci.risk_profile <> '0'
          AND ra.rm_number = $1
        GROUP BY ra.rm_number, ht.nama_produk
      ),
      ranked_all AS (
        SELECT
          rm_number,
          nama_produk,
          total_amount,
          ROW_NUMBER() OVER (PARTITION BY rm_number ORDER BY total_amount DESC) AS rn
        FROM all_products
      ),
      profile_products AS (
        SELECT
          ra.rm_number,
          ci.risk_profile,
          ht.nama_produk,
          SUM(ht.jumlah_amount) AS total_amount
        FROM historical_transaction ht
        JOIN customer_info ci 
          ON ht.bp_number_wm_core = ci.bp_number_wm_core
        JOIN rm_account ra 
          ON ci.assigned_rm = ra.rm_number
        WHERE ci.risk_profile <> '0'
          AND ra.rm_number = $1
        GROUP BY ra.rm_number, ci.risk_profile, ht.nama_produk
      ),
      ranked_profile AS (
        SELECT
          rm_number,
          risk_profile,
          nama_produk,
          total_amount,
          ROW_NUMBER() OVER (PARTITION BY rm_number, risk_profile ORDER BY total_amount DESC) AS rn
        FROM profile_products
      )
      SELECT 
        rm_number,
        'All' AS category,
        nama_produk,
        total_amount
      FROM ranked_all
      WHERE rn <= 5

      UNION ALL

      SELECT
        rm_number,
        risk_profile AS category,
        nama_produk,
        total_amount
      FROM ranked_profile
      WHERE rn <= 5

      ORDER BY rm_number, category, total_amount DESC;
      `, [rm_number]);
    return {
      all: result.rows
        .filter((row) => row.category === "All")
        .map((row) => ({
          product: row.nama_produk,
          amount: parseFloat(row.total_amount || 0),
          category: "All",
        })),
      conservative: result.rows
        .filter((row) => row.category === "1 - Conservative")
        .map((row) => ({
          product: row.nama_produk,
          amount: parseFloat(row.total_amount || 0),
          category: "Conservative",
        })),
      balanced: result.rows
        .filter((row) => row.category === "2 - Balanced")
        .map((row) => ({
          product: row.nama_produk,
          amount: parseFloat(row.total_amount || 0),
          category: "Balanced",
        })),
      moderate: result.rows
        .filter((row) => row.category === "3 - Moderate")
        .map((row) => ({
          product: row.nama_produk,
          amount: parseFloat(row.total_amount || 0),
          category: "Moderate",
        })),
      growth: result.rows
        .filter((row) => row.category === "4 - Growth")
        .map((row) => ({
          product: row.nama_produk,
          amount: parseFloat(row.total_amount || 0),
          category: "Growth",
        })),
      aggressive: result.rows
        .filter((row) => row.category === "5 - Aggressive")
        .map((row) => ({
          product: row.nama_produk,
          amount: parseFloat(row.total_amount || 0),
          category: "Aggressive",
        })),
    };
};

const getCertainCustomerList = async (rm_number: string, customerRisk: string) => {
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
WHERE ra.rm_number = $1 AND ci.risk_profile = $2
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
`, [rm_number, customerRisk]);
  return result.rows;
};

export {
  getTotalCustomer,
  getTotalAUM,
  getTotalFBI,
  getQuarterlyFBI,
  getQuarterlyFUM,
  getTopProducts,
  getCertainCustomerList,
};
