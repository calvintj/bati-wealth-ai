import fs from "fs/promises";
import { type NextRequest, NextResponse } from "next/server";
import path from "path";
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

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id;

  const filePath = path.join(process.cwd(), "public/customers-1.json");

  const customersJson = await fs.readFile(filePath, "utf-8");

  const customer = mapJsonToCustomers(
    Array.from(JSON.parse(customersJson))
  ).find((customer) => customer.customerId.toString() === id);

  if (!customer) {
    return NextResponse.json(
      { data: null, message: "Customer not found." },
      { status: 404 }
    );
  }

  return NextResponse.json({ data: customer, statusCode: 200 });
}
