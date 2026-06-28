type User = {
  name: string;
  role: "admin" | "member";
};

function parseUser(input: unknown): User {
  if (!input || typeof input !== "object") throw new Error("Invalid user");

  const value = input as Record<string, unknown>;
  if (typeof value.name !== "string") throw new Error("Missing name");
  if (value.role !== "admin" && value.role !== "member") throw new Error("Missing role");

  return { name: value.name, role: value.role };
}

console.log(parseUser({ name: "Grace", role: "admin" }).name);
