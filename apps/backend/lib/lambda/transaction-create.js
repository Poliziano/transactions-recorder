const { createTransaction } = require("../data/transactions");
const { TransactionEntity } = require("../entity/transaction-entity");

const Ajv = require("ajv");
const ajv = new Ajv();

const schema = {
  type: "object",
  properties: {
    userId: { type: "string" },
    date: { type: "string" },
    name: { type: "string" },
    amount: { type: "number" },
    type: { type: "string" }
  },
  required: ["userId", "date", "name", "amount", "type"],
  additionalProperties: false
}

const validate = ajv.compile(schema);

exports.handler = async function(event) {
  console.log("event", JSON.stringify(event, null, 2));
  
  try {
    const payload = Object.assign(JSON.parse(event.body), {
      userId: event.pathParameters.userId
    });

    if (validate(payload)) {
      const entity = new TransactionEntity(payload);
      await createTransaction(entity);
    
      return {
        statusCode: 200
      };
    } else {
      return {
        statusCode: 400
      };
    }
  } catch (err) {
    console.error("failed to parse payload", JSON.stringify(err, null, 2));

    return {
      statusCode: 400
    };
  }
};