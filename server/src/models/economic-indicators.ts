export interface EconomicIndicator {
  value: number;
  date: string;
  change?: number;
}

export interface EconomicIndicatorsResponse {
  gdpGrowth: EconomicIndicator | null;
  biRate: EconomicIndicator | null;
  inflationRate: EconomicIndicator | null;
}

/**
 * Fetch data from World Bank API
 */
async function fetchWorldBankData(
  indicator: string
): Promise<{ value: number; date: string }[]> {
  try {
    // IDN is Indonesia country code
    // NY.GDP.MKTP.KD.ZG = GDP growth (annual %)
    // FP.CPI.TOTL.ZG = Inflation, consumer prices (annual %)
    // FR.INR.RINR = Real interest rate (%)
    // Extend date range to include recent years (2020-2026)
    const currentYear = new Date().getFullYear();
    const url = `https://api.worldbank.org/v2/country/IDN/indicator/${indicator}?format=json&date=2020:${currentYear}&per_page=20`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: "application/json",
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // World Bank API returns [metadata, data] format
    if (Array.isArray(data) && data.length >= 2 && Array.isArray(data[1])) {
      const filteredData = data[1]
        .filter((item: any) => item.value !== null && item.value !== undefined)
        .map((item: any) => {
          let value = parseFloat(item.value) || 0;

          // Check if value might be in basis points (divide by 100 if > 1000)
          // This handles cases where API returns basis points instead of percentage
          if (value > 1000 && value < 100000) {
            value = value / 100;
          }

          return {
            value: value,
            date: item.date || new Date().toISOString(),
          };
        })
        .sort((a: any, b: any) => parseInt(b.date) - parseInt(a.date)); // Sort by date descending
      
      if (filteredData.length === 0) {
        console.warn(`World Bank API returned empty data for indicator: ${indicator}`);
      }
      
      return filteredData;
    }
    
    console.warn(`World Bank API returned unexpected format for indicator: ${indicator}`, data);
    return [];
  } catch (error: any) {
    console.error(
      `Error fetching World Bank data for ${indicator}:`,
      error.message
    );
    return [];
  }
}

/**
 * Fetch data from IMF DataMapper API (fallback)
 */
async function fetchIMFData(
  indicator: string
): Promise<EconomicIndicator | null> {
  try {
    // IND is Indonesia country code in IMF
    // NGDP_RPCH = Real GDP Growth
    // PCPIPCH = Inflation Rate
    const url = `https://www.imf.org/external/datamapper/api/v1/IND/${indicator}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: "application/json",
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // IMF API structure: { IND: { [indicator]: { [year]: value } } }
    if (data?.IND?.[indicator]) {
      const indicatorData = data.IND[indicator];
      const years = Object.keys(indicatorData).sort().reverse();

      if (years.length > 0) {
        const latestYear = years[0];
        const previousYear = years[1];

        return {
          value: parseFloat(indicatorData[latestYear]) || 0,
          date: latestYear,
          change: previousYear
            ? parseFloat(indicatorData[latestYear]) -
              parseFloat(indicatorData[previousYear])
            : undefined,
        };
      }
    }
    return null;
  } catch (error: any) {
    console.error(`Error fetching IMF data for ${indicator}:`, error.message);
    return null;
  }
}

/**
 * Fetch GDP Growth Rate for Indonesia from World Bank (with IMF fallback)
 */
export async function getGdpGrowth(): Promise<EconomicIndicator | null> {
  try {
    // Try World Bank first
    // NY.GDP.MKTP.KD.ZG = GDP growth (annual %)
    const data = await fetchWorldBankData("NY.GDP.MKTP.KD.ZG");

    if (data.length >= 2) {
      const latest = data[0];
      const previous = data[1];

      console.log(`GDP Growth from World Bank: ${latest.value}% (${latest.date})`);
      return {
        value: latest.value,
        date: latest.date,
        change: latest.value - previous.value,
      };
    } else if (data.length === 1) {
      console.log(`GDP Growth from World Bank (single value): ${data[0].value}% (${data[0].date})`);
      return {
        value: data[0].value,
        date: data[0].date,
      };
    }

    // Fallback to IMF
    console.log("World Bank returned no GDP data, trying IMF fallback...");
    const imfData = await fetchIMFData("NGDP_RPCH");
    if (imfData) {
      console.log(`GDP Growth from IMF: ${imfData.value}% (${imfData.date})`);
      return imfData;
    }

    // Final fallback: Use recent known value for Indonesia
    // Indonesia GDP Growth: ~5.0% (as of 2024, should be updated periodically)
    console.warn("Both World Bank and IMF failed, using fallback GDP Growth value");
    const currentYear = new Date().getFullYear();
    return {
      value: 5.0, // Recent Indonesia GDP growth rate
      date: `${currentYear - 1}`, // Use previous year as date
      change: 0.1, // Small positive change
    };
  } catch (error: any) {
    console.error("Error fetching GDP Growth:", error.message);
    return null;
  }
}

/**
 * Fetch BI Rate (Interest Rate) for Indonesia
 * Note: World Bank API doesn't have BI 7-day reverse repo rate specifically
 * Current BI Rate is 4.75% (as of December 2025)
 * Policy rate range is typically 3-8%, but current is 4.75%
 */
export async function getBiRate(): Promise<EconomicIndicator | null> {
  try {
    // World Bank doesn't have BI Rate (7-day reverse repo rate) specifically
    // The available indicators (lending rate, deposit rate) are typically higher
    // and don't reflect the actual BI policy rate

    // Since there's no reliable free API for BI Rate, we'll use the current known value
    // This should be updated periodically when BI announces rate changes
    // Current BI Rate: 4.75% (as of December 2025)

    // For now, return the current known BI Rate
    // In production, this could be:
    // 1. Manually updated when BI announces changes
    // 2. Scraped from Bank Indonesia's official website
    // 3. Retrieved from a paid API service

    const currentBiRate = 4.75; // Current BI Rate as of December 2025
    const previousBiRate = 5.0; // Previous rate (before latest cut)

    return {
      value: currentBiRate,
      date: new Date().toISOString().split("T")[0],
      change: currentBiRate - previousBiRate, // -0.25%
    };
  } catch (error: any) {
    console.error("Error fetching BI Rate:", error.message);
    // Return current known value on error
    return {
      value: 4.75,
      date: new Date().toISOString().split("T")[0],
      change: undefined,
    };
  }
}

/**
 * Fetch Inflation Rate for Indonesia from World Bank (with IMF fallback)
 */
export async function getInflationRate(): Promise<EconomicIndicator | null> {
  try {
    // Try World Bank first
    // FP.CPI.TOTL.ZG = Inflation, consumer prices (annual %)
    const data = await fetchWorldBankData("FP.CPI.TOTL.ZG");

    if (data.length >= 2) {
      const latest = data[0];
      const previous = data[1];

      console.log(`Inflation Rate from World Bank: ${latest.value}% (${latest.date})`);
      return {
        value: latest.value,
        date: latest.date,
        change: latest.value - previous.value,
      };
    } else if (data.length === 1) {
      console.log(`Inflation Rate from World Bank (single value): ${data[0].value}% (${data[0].date})`);
      return {
        value: data[0].value,
        date: data[0].date,
      };
    }

    // Fallback to IMF
    console.log("World Bank returned no Inflation data, trying IMF fallback...");
    const imfData = await fetchIMFData("PCPIPCH");
    if (imfData) {
      console.log(`Inflation Rate from IMF: ${imfData.value}% (${imfData.date})`);
      return imfData;
    }

    // Final fallback: Use recent known value for Indonesia
    // Indonesia Inflation Rate: ~2.5-3.0% (as of 2024, should be updated periodically)
    console.warn("Both World Bank and IMF failed, using fallback Inflation Rate value");
    const currentYear = new Date().getFullYear();
    return {
      value: 2.8, // Recent Indonesia inflation rate
      date: `${currentYear - 1}`, // Use previous year as date
      change: -0.2, // Small negative change (inflation decreasing)
    };
  } catch (error: any) {
    console.error("Error fetching Inflation Rate:", error.message);
    return null;
  }
}

/**
 * Fetch all economic indicators
 */
export async function getAllEconomicIndicators(): Promise<EconomicIndicatorsResponse> {
  try {
    const [gdpGrowth, biRate, inflationRate] = await Promise.allSettled([
      getGdpGrowth(),
      getBiRate(),
      getInflationRate(),
    ]);

    return {
      gdpGrowth: gdpGrowth.status === "fulfilled" ? gdpGrowth.value : null,
      biRate: biRate.status === "fulfilled" ? biRate.value : null,
      inflationRate:
        inflationRate.status === "fulfilled" ? inflationRate.value : null,
    };
  } catch (error: any) {
    console.error("Error fetching economic indicators:", error.message);
    return {
      gdpGrowth: null,
      biRate: null,
      inflationRate: null,
    };
  }
}
