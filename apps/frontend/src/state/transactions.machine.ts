import type { TransactionEntity, TransactionEntityCreateParams } from '../api/transaction';
import { assign, createMachine } from 'xstate';

export type Context = {
	transactions: TransactionEntity[];
};

export type Events =
	| FetchTransactionsEvent
	| FetchTransactionsDoneEvent
	| CreateTransactionEvent
	| CreateTransactionDoneEvent
	| DeleteTransactionEvent
	| DeleteTransactionDoneEvent;

export type FetchTransactionsEvent = {
	type: 'FETCH_TRANSACTIONS';
	userId: string;
};
export type FetchTransactionsDoneEvent = {
	type: 'done.invoke.fetchingTransactions:invocation[0]';
	data: TransactionEntity[];
};
export type CreateTransactionEvent = {
	type: 'CREATE_TRANSACTION';
	data: TransactionEntityCreateParams;
};
export type CreateTransactionDoneEvent = {
	type: 'done.invoke.creatingTransaction:invocation[0]';
	data: TransactionEntity;
};
export type DeleteTransactionEvent = {
	type: 'DELETE_TRANSACTION';
	data: TransactionEntity;
};
export type DeleteTransactionDoneEvent = {
	type: 'done.invoke.deletingTransaction:invocation[0]';
	data: TransactionEntity;
};

export type CreateTransactionsMachineParams = {
	fetchTransactions: (
		context: Context,
		event: FetchTransactionsEvent
	) => Promise<TransactionEntity[]>;

	createTransaction: (
		context: Context,
		event: CreateTransactionEvent
	) => Promise<TransactionEntity>;

	deleteTransaction: (
		context: Context,
		event: DeleteTransactionEvent
	) => Promise<TransactionEntity>;
};

export function createTransactionsMachine(params: CreateTransactionsMachineParams) {
	return createMachine<Context, Events>(
		{
			context: {
				transactions: []
			},
			initial: 'waiting',
			states: {
				waiting: {
					on: {
						FETCH_TRANSACTIONS: 'fetchingTransactions',
						CREATE_TRANSACTION: 'creatingTransaction',
						DELETE_TRANSACTION: 'deletingTransaction'
					}
				},
				fetchingTransactions: {
					id: 'fetchingTransactions',
					invoke: {
						src: 'fetchTransactions',
						onDone: {
							target: 'waiting',
							actions: ['assignTransactions']
						}
					}
				},
				creatingTransaction: {
					id: 'creatingTransaction',
					invoke: {
						src: 'createTransaction',
						onDone: {
							target: 'waiting',
							actions: ['appendTransaction']
						}
					}
				},
				deletingTransaction: {
					id: 'deletingTransaction',
					invoke: {
						src: 'deleteTransaction',
						onDone: {
							target: 'waiting',
							actions: ['removeTransaction']
						}
					}
				}
			}
		},
		{
			services: {
				fetchTransactions: (context, event) =>
					params.fetchTransactions(context, event as FetchTransactionsEvent),
				createTransaction: (context, event) =>
					params.createTransaction(context, event as CreateTransactionEvent),
				deleteTransaction: (context, event) =>
					params.deleteTransaction(context, event as DeleteTransactionEvent)
			},
			actions: {
				assignTransactions: assign((_context, event) => {
					console.log(JSON.stringify(event));
					return {
						transactions: (event as FetchTransactionsDoneEvent).data
					};
				}),
				appendTransaction: assign((context, event) => ({
					transactions: [...context.transactions, (event as CreateTransactionDoneEvent).data]
				})),
				removeTransaction: assign((context, event) => ({
					transactions: context.transactions.filter(
						(value) => value.uuid !== (event as DeleteTransactionEvent).data.uuid
					)
				}))
			}
		}
	);
}
