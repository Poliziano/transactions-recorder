import type {
  TransactionEntity,
  TransactionEntityCreateParams,
  TransactionsForDateResponse,
} from "$lib/api/transaction";
import type {
  ListTransactionsDailySum,
  ListTransactionsDailySumResponse,
} from "transactions-schema";
import { endpoint } from "../api/api";

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
  transaction: TransactionEntityCreateParams
): Promise<TransactionEntity> {
  const { userId, name, amount, date, type } = transaction;
  const response = await fetch(`${endpoint}/users/${userId}/transactions`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      name,
      amount,
      date,
      type,
    }),
  });

  return response.json();
}

export async function deleteTransaction(uuid: string) {
  const url = `${endpoint}/users/abc/transactions/${uuid}`;

  await fetch(url, {
    method: "DELETE",
  });
}
