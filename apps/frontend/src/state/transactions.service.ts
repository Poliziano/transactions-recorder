import { endpoint } from "../api/api";
import type {
  Context,
  CreateTransactionEvent,
  DeleteTransactionEvent,
} from "./transactions.machine";
import type { ListTransactionsDailySumResponse } from "transactions-schema";

export async function fetchTransactions(): Promise<ListTransactionsDailySumResponse> {
  const url = `${endpoint}/users/abc/transactions/aggregations`;
  const response = await fetch(url, {
    method: "GET",
  });
  if (!response.ok) {
    throw new Error();
  }
  return await response.json();
}

export async function createTransaction(
  _: Context,
  event: CreateTransactionEvent
) {
  const url = `${endpoint}/users/abc/transactions`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(event.data),
  });

  return response.json();
}

export async function deleteTransaction(
  _: Context,
  event: DeleteTransactionEvent
) {
  const url = `${endpoint}/users/abc/transactions/${event.data.uuid}`;

  await fetch(url, {
    method: "DELETE",
  });

  return event.data;
}
