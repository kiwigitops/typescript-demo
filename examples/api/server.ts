import { createServer, type IncomingMessage, type Server, type ServerResponse } from "node:http";
import { pathToFileURL } from "node:url";
import {
  filterByDifficulty,
  findRoadmapItem,
  getRoadmapSummary,
  isDifficulty,
  roadmapItems,
  type Difficulty,
  type RoadmapItem,
  type RoadmapSummary,
} from "../../src/shared/roadmap";

type HealthResponse = {
  ok: true;
  service: "typescript-demo-api";
};

type RoadmapResponse = {
  items: readonly RoadmapItem[];
  summary: RoadmapSummary;
};

type RoadmapItemResponse = {
  item: RoadmapItem;
};

type ApiError = {
  error: {
    code: string;
    message: string;
  };
};

type ApiPayload = ApiError | HealthResponse | RoadmapItemResponse | RoadmapResponse;

const DEFAULT_PORT = 4174;
const HOST = "127.0.0.1";

export function createApiServer(): Server {
  return createServer(handleRequest);
}

export function readPort(value = process.env.PORT): number {
  if (!value) return DEFAULT_PORT;

  const port = Number(value);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error(`PORT must be an integer from 1 to 65535. Received: ${value}`);
  }
  return port;
}

function handleRequest(request: IncomingMessage, response: ServerResponse): void {
  setCorsHeaders(response);

  if (request.method === "OPTIONS") {
    response.writeHead(204);
    response.end();
    return;
  }

  if (request.method !== "GET") {
    sendJson(response, 405, {
      error: {
        code: "method_not_allowed",
        message: "Only GET requests are supported.",
      },
    });
    return;
  }

  const url = parseRequestUrl(request);
  if (!url) {
    sendJson(response, 400, {
      error: {
        code: "bad_request",
        message: "Request URL could not be parsed.",
      },
    });
    return;
  }

  if (url.pathname === "/api/health") {
    sendJson(response, 200, { ok: true, service: "typescript-demo-api" });
    return;
  }

  if (url.pathname === "/api/roadmap") {
    sendJson(response, 200, buildRoadmapResponse(url.searchParams.get("difficulty")));
    return;
  }

  if (url.pathname.startsWith("/api/roadmap/")) {
    const id = decodeURIComponent(url.pathname.slice("/api/roadmap/".length));
    const item = findRoadmapItem(id);

    if (!item) {
      sendJson(response, 404, {
        error: {
          code: "not_found",
          message: `Roadmap item '${id}' was not found.`,
        },
      });
      return;
    }

    sendJson(response, 200, { item });
    return;
  }

  sendJson(response, 404, {
    error: {
      code: "not_found",
      message: "Route not found.",
    },
  });
}

function buildRoadmapResponse(difficultyParam: string | null): RoadmapResponse | ApiError {
  if (!difficultyParam) {
    return {
      items: roadmapItems,
      summary: getRoadmapSummary(roadmapItems),
    };
  }

  if (!isDifficulty(difficultyParam)) {
    return {
      error: {
        code: "invalid_difficulty",
        message: "Difficulty must be beginner, intermediate, or advanced.",
      },
    };
  }

  const difficulty: Difficulty = difficultyParam;
  const items = filterByDifficulty(difficulty);
  return {
    items,
    summary: getRoadmapSummary(items),
  };
}

function parseRequestUrl(request: IncomingMessage): URL | null {
  try {
    return new URL(request.url ?? "/", `http://${request.headers.host ?? HOST}`);
  } catch {
    return null;
  }
}

function sendJson(response: ServerResponse, statusCode: number, payload: ApiPayload): void {
  const effectiveStatusCode = "error" in payload && statusCode === 200 ? 400 : statusCode;

  response.writeHead(effectiveStatusCode, {
    "Content-Type": "application/json; charset=utf-8",
  });
  response.end(`${JSON.stringify(payload, null, 2)}\n`);
}

function setCorsHeaders(response: ServerResponse): void {
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");
  response.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  response.setHeader("Access-Control-Allow-Origin", "*");
}

const directRunPath = process.argv[1] ? pathToFileURL(process.argv[1]).href : "";

if (import.meta.url === directRunPath) {
  const port = readPort();
  createApiServer().listen(port, HOST, () => {
    console.log(`TypeScript demo API listening on http://${HOST}:${port}`);
  });
}

