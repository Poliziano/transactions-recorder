import type { TransactionEntity } from "src/api/transaction";

export function aggregateTransactions(
  transactions: TransactionEntity[]
): number {
  return transactions.reduce(
    (previous, current) => previous + current.amount,
    0
  );
}
