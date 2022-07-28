export type TransactionEntity = {
  userId: string;
  name: string;
  amount: number;
  type: "income" | "expenditure";
  date: string;
  uuid: string;
};

export type TransactionEntityCreateParams = Omit<TransactionEntity, "uuid">;

export type TransactionsForDateResponse = {
  transactions: TransactionEntity[];
};
