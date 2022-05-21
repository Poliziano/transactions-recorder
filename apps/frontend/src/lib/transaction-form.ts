import type { TransactionEntity } from "src/api/transaction";

export type TransactionFormParams = Pick<TransactionEntity, "date"> &
  Omit<Partial<TransactionEntity>, "date">;
