import { type ClassValue, clsx } from "clsx";
import moment from "moment";
import { twMerge } from "tailwind-merge";

import { Customer, JsonCustomer, TransactionLabel } from "@/types/customer-v2";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function sortByDate<T>(responses: T[], dateKey: keyof T) {
  const sortedResponses = responses.sort((a, b) => {
    const dateA = new Date(a[dateKey] as string);
    const dateB = new Date(b[dateKey] as string);
    return dateB.getTime() - dateA.getTime();
  });

  return sortedResponses;
}

export function groupResponseListByDate<T>(responses: T[], dateKey: keyof T) {
  const sortedResponse = sortByDate(responses, "updatedAt" as keyof T);

  const groupedResponse = sortedResponse.reduce(
    (acc: Record<string, T[]>, response: T) => {
      const date = (response[dateKey] as string).split("T")[0];

      if (!acc[date]) {
        acc[date] = [];
      }

      acc[date].push(response);

      return acc;
    },
    {}
  );
  return groupedResponse;
}

export function formatDateRelative(date: Date) {
  let fmtdDate: string;
  const momentDate = moment(date);

  if (momentDate.isSame(moment(), "day")) {
    fmtdDate = "Today";
  } else if (momentDate.isSame(moment().subtract(1, "day"), "day")) {
    fmtdDate = "Yesterday";
  } else if (momentDate.isAfter(moment().subtract(7, "days"), "day")) {
    fmtdDate = "Previous 7 Days";
  } else {
    fmtdDate = momentDate.format("MMMM D, YYYY");
  }

  return fmtdDate;
}

export function mapJsonToCustomers(jsonData: JsonCustomer[]): Customer[] {
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

export function mapCustomersToJson(customers: Customer[]): JsonCustomer[] {
  return customers.map((data) => ({
    "Customer ID": data.customerId,
    "Assigned RM": data.assignedRm,
    "Customer Type": data.customerType,
    "Priority/Private": data.priorityPrivate,
    "Transaction Label": data.transactionLabel || "None", // Assuming default value
    "AUM Label": data.aumLabel,
    "Propensity BAC": data.propensityBAC,
    "Propensity SB": data.propensitySB,
    "Propensity RD": data.propensityRD,
    "Score Overall": data.scoreOverall,
    "Score BAC": data.scoreBAC,
    "Score SB": data.scoreSB,
    "Score RD": data.scoreRD,
    "Risk Profile": data.riskProfile,
    "Customer Name": data.customerName,
  }));
}

export function omitProperties<T, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  const result = {} as Omit<T, K>;

  // @ts-expect-error this is correct dont bother
  (Object.keys(obj) as (keyof T)[]).forEach((key) => {
    if (!keys.includes(key as K)) {
      // @ts-expect-error this is correct dont bother
      result[key] = obj[key];
    }
  });

  return result;
}
