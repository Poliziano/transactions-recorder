import type {
  TransactionEntity,
  TransactionsForDateResponse,
} from "$lib/api/transaction";
import type {
  ListTransactionsDailySum,
  ListTransactionsDailySumResponse,
} from "transactions-schema";
import { endpoint } from "../api/api";
import type {
  Context,
  SubmitTransactionFormEvent,
} from "./transaction-page.machine";

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
  event: SubmitTransactionFormEvent
): Promise<TransactionEntity> {
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

export async function deleteTransaction(uuid: string) {
  const url = `${endpoint}/users/abc/transactions/${uuid}`;

  await fetch(url, {
    method: "DELETE",
  });
}
