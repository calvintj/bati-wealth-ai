import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase-client";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const revalidate = 43200; // 60 * 60 * 12 = 43200 seconds (12 hours)

export async function GET() {
  try {
    const timestamp = new Date().toISOString();
    console.log(
      `[${timestamp}] [INFO] Fetching composite index data from Supabase...`
    );

    const { data, error } = await supabase
      .from("bloomberg_stock_index_histories")
      .select("report_date, close_price, change_percent")
      .eq("index_code", "COMPOSITE")
      .order("report_date", { ascending: true });

    if (error) {
      console.error(`[${timestamp}] [ERROR] Supabase error:`, {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data || data.length === 0) {
      console.warn(
        `[${timestamp}] [WARN] No data returned from Supabase for composite index`
      );
      return NextResponse.json({ error: "No data available" }, { status: 404 });
    }

    console.log(
      `[${timestamp}] [INFO] Successfully fetched ${data.length} records for composite index`
    );
    return NextResponse.json(data);
  } catch (err) {
    const timestamp = new Date().toISOString();
    console.error(
      `[${timestamp}] [ERROR] Unexpected error in composite index API:`,
      err
    );
    return NextResponse.json(
      {
        error: "Internal server error",
        details: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
