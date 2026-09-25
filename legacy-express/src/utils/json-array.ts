export function toJsonArray(value: unknown): string | null {
  if (!value) return null;
  if (!Array.isArray(value)) return null;
  return JSON.stringify(value);
}

export function fromJsonArray(value: string | null): string[] {
  if (!value) return [];
  try {
    return JSON.parse(value);
  } catch {
    return [];
  }
}