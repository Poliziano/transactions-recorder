const { GenericContainer } = require("testcontainers");

module.exports = async function() {
  globalThis.container = await new GenericContainer("amazon/dynamodb-local")
    .withExposedPorts({ container: 8000, host: 8090 })
    .start();
}