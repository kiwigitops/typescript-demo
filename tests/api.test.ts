import { type AddressInfo } from "node:net";
import { type Server } from "node:http";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createApiServer, readPort } from "../examples/api/server";

describe("typed API server", () => {
  let baseUrl = "";
  let server: Server | undefined;

  beforeAll(async () => {
    server = createApiServer();
    await new Promise<void>((resolve) => {
      server?.listen(0, "127.0.0.1", resolve);
    });

    const address = server.address();
    if (!address || typeof address === "string") {
      throw new Error("Expected an ephemeral TCP address.");
    }
    baseUrl = `http://127.0.0.1:${(address as AddressInfo).port}`;
  });

  afterAll(async () => {
    await new Promise<void>((resolve, reject) => {
      server?.close((error) => {
        if (error) reject(error);
        else resolve();
      });
    });
  });

  it("returns the roadmap", async () => {
    const response = await fetch(`${baseUrl}/api/roadmap?difficulty=beginner`);
    const payload = (await response.json()) as { items: { id: string }[] };

    expect(response.status).toBe(200);
    expect(payload.items.map((item) => item.id)).toEqual(["hello-world", "types-and-values"]);
  });

  it("returns typed errors for unknown items", async () => {
    const response = await fetch(`${baseUrl}/api/roadmap/nope`);
    const payload = (await response.json()) as { error: { code: string } };

    expect(response.status).toBe(404);
    expect(payload.error.code).toBe("not_found");
  });

  it("validates ports", () => {
    expect(readPort("4174")).toBe(4174);
    expect(() => readPort("not-a-port")).toThrow("PORT must be an integer");
  });
});

