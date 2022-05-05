import type { NativeAttributeValue } from "@aws-sdk/util-dynamodb";
import KSUID from "ksuid";

type TransactionEntityParam = {
  userId: string;
  name: string;
  amount: number;
  type: string;
  date: Date;
  uuid: string;
};

export class TransactionEntity {
  userId: string;
  name: string;
  amount: number;
  type: string;
  date: Date;
  uuid: string;

  constructor({
    uuid,
    userId,
    date,
    name,
    amount,
    type,
  }: TransactionEntityParam) {
    this.userId = userId;
    this.name = name;
    this.amount = amount;
    this.type = type;
    this.date = date;
    this.uuid = uuid;
  }

  key() {
    return {
      PK: `USER#${this.userId.toLowerCase()}`,
      SK: `ID#${this.uuid}`,
    };
  }

  toItem() {
    return {
      ...this.key(),
      Name: this.name,
      Amount: this.amount,
      Type: this.type,
      Date: this.date.toISOString(),
    };
  }

  static from(item: { [index: string]: NativeAttributeValue }) {
    return new TransactionEntity({
      uuid: item.SK.split("#")[1],
      userId: item.PK.split("#")[1],
      date: new Date(item.Date),
      name: item.Name,
      amount: item.Amount,
      type: item.Type,
    });
  }

  static uuid(date = new Date()) {
    return KSUID.randomSync(date).string;
  }
}
