async function handler(event, context) {
  console.log("Ambiente", JSON.stringify(process.env, null, 2));
  console.log("Eventos", JSON.stringify(event, null, 2));

  return {
    upadate: "This is an update bro",
  };
}

module.exports = {
  handler,
};
