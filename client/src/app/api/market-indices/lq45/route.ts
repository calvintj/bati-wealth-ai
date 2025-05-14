// app/api/market-indices/composite/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase-client";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const revalidate = 60 * 60 * 12;

export async function GET() {
  const { data, error } = await supabase
    .from("bloomberg_stock_index_histories")
    .select("report_date, close_price, change_percent")
    .eq("index_code", "LQ45")
    .order("report_date", { ascending: true });

  if (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
