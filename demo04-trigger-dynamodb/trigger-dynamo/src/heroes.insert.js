//CLASS MODE
/* class Handler {
  async main() {
    try {
      return {
        statusCode: 200,
        body: "Hello Hero",
      };
    } catch (error) {
      return { statusCode: 500, body: "Deu error" };
    }
  }
}

const handler = new Handler();
module.exports = handler.main.bind(handler);

 */
//FUNCTION MODE

const uuid = require("uuid");
const AWS = require("aws-sdk");
const JOI = require("@hapi/joi");
const decoratorValidator = require("./util/decoraterValidator");
const enumParams = require("./util/globalEnum");
const dynamoDb = new AWS.DynamoDB.DocumentClient();

async function prepareData(data) {
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: {
      ...data,
      id: uuid.v1(),
      createdAt: new Date().toISOString(),
    },
  };
  return params;
}

async function validator() {
  return JOI.object({
    nome: JOI.string().max(100).min(2).required(),
    poder: JOI.string().max(30).min(2).required(),
  });
}

async function insertData(prepareData) {
  try {
    return await dynamoDb.put(prepareData).promise();
  } catch (error) {
    {
      return err;
    }
  }
}

async function handlerSuccess(data) {
  const response = {
    statusCode: 200,
    body: await JSON.stringify(data),
  };
  return response;
}

async function handlerError(data) {
  return {
    statusCode: data.statusCode || 501,
    headers: { "Content-Type": "text/plain" },
    body: "Could \t create item!!",
  };
}

async function main(event) {
  try {
    const data = JSON.parse(event.body);

    const dbParams = await prepareData(data);
    await insertData(dbParams);
    const success = await handlerSuccess(dbParams.Item);
    return success;
  } catch (error) {
    console.error("Deu merda", error.stack);
    return handlerError({ statusCode: 500 });
  }
}

module.exports = decoratorValidator(main, validator, enumParams.ARG_TYPE);
