import { unmarshall } from "@aws-sdk/util-dynamodb";
import KSUID from "ksuid";

export class TransactionEntity {
  userId: string;
  name: string;
  amount: number;
  type: string;
  date: Date;
  uuid: string;

  // @ts-ignore
  constructor({ uuid, userId, date, name, amount, type }) {
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

  static from(item: any) {
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
