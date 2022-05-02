const { unmarshall } = require("@aws-sdk/util-dynamodb");
const KSUID = require('ksuid')

class TransactionEntity {

  #uuid;

  constructor({
    userId,
    date,
    name,
    amount,
    type,
  }) {
    this.userId = userId;
    this.name = name;
    this.amount = amount;
    this.type = type;
    this.date = date

    this.#uuid = KSUID.randomSync(this.date).string;
  }

  key() {
    return {
      PK: { S: `USER#${this.userId.toLowerCase()}` },
      SK: { S: `ID#${this.#uuid}` }
    }
  }

  toItem() {
    return {
      ...this.key(),
      Name: { S: this.name },
      Amount: { N: `${this.amount}` },
      Type: { S: this.type },
      Date: { S: this.date }
    }
  }

  static from(item) {
    const output = unmarshall(item);

    return new TransactionEntity({
      userId: output.PK.split("#")[1],
      date: new Date(output.Date),
      name: output.Name,
      amount: output.Amount,
      type: output.Type
    })
  }
}

module.exports = { TransactionEntity };