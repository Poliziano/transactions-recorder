import type { TransactionEntity } from "$lib/api/transaction";

export type TransactionFormParams = Pick<TransactionEntity, "date"> &
  Omit<Partial<TransactionEntity>, "date">;
