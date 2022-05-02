exports.handler = async function() {
  console.log("hello world!");
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Hello, World!"
    })
  }
};