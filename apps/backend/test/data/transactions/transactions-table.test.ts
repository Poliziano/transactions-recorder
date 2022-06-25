import { ListTablesCommand } from "@aws-sdk/client-dynamodb";
import { db } from "../../../lib/data/dynamo";

test("should have table named Transactions", async () => {
  const list = new ListTablesCommand({});
  const result = await db.send(list);
  expect(result.TableNames).toStrictEqual(["Transactions"]);
});
