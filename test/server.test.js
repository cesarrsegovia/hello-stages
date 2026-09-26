const test = require("node:test");
const assert = require("node:assert/strict");

process.env.APP_STAGE = "test";
process.env.APP_VERSION = "test-build";

const { createServer } = require("../src/server");

async function withServer(run) {
  const server = createServer();
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const { port } = server.address();

  try {
    await run(`http://127.0.0.1:${port}`);
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => error ? reject(error) : resolve());
    });
  }
}

test("GET / responde Hello World", async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/`);
    const body = await response.json();
    assert.equal(response.status, 200);
    assert.equal(body.mensaje, "Hello World");
  });
});

test("GET /saludo personaliza el nombre", async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/saludo?nombre=Ana`);
    const body = await response.json();
    assert.equal(body.mensaje, "Hola, Ana!");
    assert.equal(body.feature, "saludo-personalizado");
  });
});

test("GET /api/info informa el stage", async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/info`);
    const body = await response.json();
    assert.equal(body.stage, "test");
    assert.equal(body.version, "test-build");
  });
});
