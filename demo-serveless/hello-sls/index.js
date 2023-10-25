module.exports.handler = async (event) => {
  console.log("Valor do evento ne ", JSON.stringify(event, null, 2));
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: "Esse e um teste bora testar",
        input: event,
      },
      null,
      2
    ),
  };
};
