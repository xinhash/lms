export function objectDefined<T>(obj: T): T {
  const acc: Partial<T> = {};
  for (const key in obj) {
    if (obj[key] !== undefined || obj[key] !== null) acc[key] = obj[key];
  }
  return acc as T;
}
