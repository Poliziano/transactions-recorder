import { endpoint } from "../api/api";
import type { TransactionEntity } from "../api/transaction";
import type {
  Context,
  CreateTransactionEvent,
  DeleteTransactionEvent,
} from "./transactions.machine";

export async function fetchTransactions(): Promise<TransactionEntity[]> {
  const url = `${endpoint}/users/abc/transactions`;
  const response = await fetch(url, {
    method: "GET",
  });
  if (!response.ok) {
    throw new Error();
  }
  const json = await response.json();
  return [...json.transactions, ...json.transactions, ...json.transactions];
}

export async function createTransaction(
  _: Context,
  event: CreateTransactionEvent
) {
  const url = `${endpoint}/users/abc/transactions`;

  const response = await fetch(url, {
    method: "POST",
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
