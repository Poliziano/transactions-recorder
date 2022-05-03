const { unmarshall } = require("@aws-sdk/util-dynamodb");
const KSUID = require("ksuid");

class TransactionEntity {
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
      PK: { S: `USER#${this.userId.toLowerCase()}` },
      SK: { S: `ID#${this.uuid}` },
    };
  }

  toItem() {
    return {
      ...this.key(),
      Name: { S: this.name },
      Amount: { N: `${this.amount}` },
      Type: { S: this.type },
      Date: { S: this.date },
    };
  }

  static from(item) {
    const output = unmarshall(item);

    return new TransactionEntity({
      uuid: output.SK.split("#")[1],
      userId: output.PK.split("#")[1],
      date: new Date(output.Date),
      name: output.Name,
      amount: output.Amount,
      type: output.Type,
    });
  }

  static uuid(date = new Date()) {
    return KSUID.randomSync(date).string;
  }
}

module.exports = { TransactionEntity };
