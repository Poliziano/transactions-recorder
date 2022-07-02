import { endpoint } from "../api/api";
import type {
  Context,
  CreateTransactionEvent,
  DeleteTransactionEvent,
} from "./transactions.machine";
import type {
  ListTransactionsDailySum,
  ListTransactionsDailySumResponse,
} from "transactions-schema";
import type {
  TransactionEntity,
  TransactionsForDateResponse,
} from "src/api/transaction";

export async function fetchTransactionsDailySum(): Promise<ListTransactionsDailySum> {
  const url = `${endpoint}/users/abc/transactions/aggregations`;
  const response = await fetch(url, {
    method: "GET",
  });
  if (!response.ok) {
    throw new Error();
  }
  const responseBody: ListTransactionsDailySumResponse = await response.json();
  return responseBody.aggregations;
}

export async function fetchTransactionsForDate(
  date: string
): Promise<TransactionEntity[]> {
  const url = `${endpoint}/users/abc/transactions/date/${date}`;
  const response = await fetch(url, {
    method: "GET",
  });
  if (!response.ok) {
    throw new Error();
  }
  const responseBody: TransactionsForDateResponse = await response.json();
  return responseBody.transactions;
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
