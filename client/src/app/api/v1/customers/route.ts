import fs from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

import { Paginated } from "@/lib/paginated";
import { Customer, TransactionLabel } from "@/types/customer-v2";

export const runtime = "nodejs";
export const maxDuration = 30;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapJsonToCustomers(jsonData: any[]): Customer[] {
  return jsonData.map((data) => ({
    customerId: data["Customer ID"],
    assignedRm: data["Assigned RM"],
    customerType: data["Customer Type"],
    priorityPrivate: data["Priority/Private"],
    transactionLabel: data["Transaction Label"] || TransactionLabel.None,
    aumLabel: data["AUM Label"],
    propensityBAC: data["Propensity BAC"],
    propensitySB: data["Propensity SB"],
    propensityRD: data["Propensity RD"],
    scoreOverall: data["Score Overall"],
    scoreBAC: data["Score BAC"],
    scoreSB: data["Score SB"],
    scoreRD: data["Score RD"],
    riskProfile: data["Risk Profile"],
    customerName: data["Customer Name"],
  }));
}

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const limit = Number(searchParams.get("limit")) || 10000;
  const page = Number(searchParams.get("page")) || 1;

  for (const [k, v] of Object.entries(searchParams.entries())) {
    console.log(k, "=", v);
  }

  const filePath = path.join(process.cwd(), "public/customers-1.json");

  const customersJson = await fs.readFile(filePath, "utf-8");

  const customers: Customer[] = mapJsonToCustomers(
    Array.from(JSON.parse(customersJson))
  );

  const paginatedResponse = Paginated.paginate(
    customers,
    page,
    limit,
    req.nextUrl.protocol +
      req.nextUrl.hostname +
      ":" +
      req.nextUrl.port +
      req.nextUrl.pathname
  );

  return NextResponse.json(paginatedResponse);
}
