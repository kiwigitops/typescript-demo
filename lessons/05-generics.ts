function first<T>(items: readonly T[]): T | undefined {
  return items[0];
}

const names = ["Ada", "Grace", "Linus"] as const;

console.log(first(names));
