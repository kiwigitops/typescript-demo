import { createServer, type ServerResponse } from "node:http";
import { lessons, tracks } from "../src/course";

const host = "127.0.0.1";
const port = 4174;

const server = createServer((request, response) => {
  const url = new URL(request.url ?? "/", `http://${host}:${port}`);

  if (url.pathname === "/health") {
    sendJson(response, { ok: true });
    return;
  }

  if (url.pathname === "/lessons") {
    sendJson(response, { lessons, tracks });
    return;
  }

  response.writeHead(404, { "Content-Type": "application/json" });
  response.end(JSON.stringify({ error: "Not found" }));
});

server.listen(port, host, () => {
  console.log(`TypeScript API listening on http://${host}:${port}`);
});

function sendJson(response: ServerResponse, body: unknown): void {
  response.writeHead(200, { "Content-Type": "application/json" });
  response.end(JSON.stringify(body, null, 2));
}
