exports.handler = async function(event) {
  console.log("request: ", JSON.stringify(event, undefined, 2));
  return {
    body: `Good Night, CDK! You've hit ${event.path}\n`,
    headers: {"Content-Type": "text/plain"},
    statusCode: 200,
  };
};
