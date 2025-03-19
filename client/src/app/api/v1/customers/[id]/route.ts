import fs from "fs/promises";
import { type NextRequest, NextResponse } from "next/server";
import path from "path";

import { mapJsonToCustomers } from "@/lib/utils";

export const runtime = "nodejs";

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
  console.log(customer, "FROM SERVER");
  if (!customer)
    NextResponse.json(
      { data: null, message: "Customer not found." },
      { status: 404 }
    );

  return NextResponse.json({ data: customer, statusCode: 200 });
}
