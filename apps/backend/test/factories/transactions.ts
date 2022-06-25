import {
  createTransaction,
  putTransaction,
  TransactionCreateInput,
} from "../../lib/data/transactions/create-transaction";
import { Transaction } from "../../lib/entity/transaction";

export async function batchCreateTransactions(input: TransactionCreateInput[]) {
  for (const params of input) {
    await createTransaction(params);
  }
}

export async function batchPutTransactions(input: Transaction[]) {
  for (const params of input) {
    await putTransaction(params);
  }
}
