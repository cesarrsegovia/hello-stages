const http = require("node:http");
const { URL } = require("node:url");

const PORT = Number(process.env.PORT || 3000);
const STAGE = process.env.APP_STAGE || "local";
const VERSION = process.env.APP_VERSION || "1.0.0";
const PROJECT_NAME = "Hello Stages con saludo e información";

function sendJson(res, status, data) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(data, null, 2));
}

function handler(req, res) {
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);

  if (url.pathname === "/") {
    return sendJson(res, 200, {
      proyecto: PROJECT_NAME,
      mensaje: "Hello World",
      stage: STAGE,
      version: VERSION
    });
  }

  if (url.pathname === "/saludo") {
    const nombre = (url.searchParams.get("nombre") || "mundo").trim();
    return sendJson(res, 200, {
      feature: "saludo-personalizado",
      mensaje: `Hola, ${nombre || "mundo"}!`,
      stage: STAGE
    });
  }

  if (url.pathname === "/api/info") {
    return sendJson(res, 200, {
      feature: "informacion-entorno",
      proyecto: PROJECT_NAME,
      stage: STAGE,
      version: VERSION,
      node: process.version
    });
  }

  return sendJson(res, 404, { error: "Ruta no encontrada" });
}

function createServer() {
  return http.createServer(handler);
}

if (require.main === module) {
  createServer().listen(PORT, () => {
    console.log(`${PROJECT_NAME} en http://localhost:${PORT} [${STAGE}]`);
  });
}

module.exports = { createServer, handler };
