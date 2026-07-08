import type { FieldSuggestion, Surgery } from "@/lib/surgeries/types";

export type SuggestionField =
  | "hospital"
  | "procedure"
  | "diagnosis"
  | "lead_surgeon"
  | "my_role"
  | "implants"
  | "patient_sport"
  | "complications"
  | "senior_surgeon_pearls"
  | "lessons_learned";

export function buildFieldSuggestions(
  surgeries: Surgery[],
  field: SuggestionField,
  favorites: string[] = []
): FieldSuggestion[] {
  const map = new Map<string, FieldSuggestion>();
  const favoriteSet = new Set(favorites.map(normalize));

  for (const surgery of surgeries) {
    const raw = surgery[field];
    if (!raw) continue;

    for (const value of splitSuggestionValue(raw)) {
      const key = normalize(value);
      if (!key) continue;

      const existing = map.get(key);
      if (existing) {
        existing.count += 1;
        if (surgery.created_at > existing.latest) {
          existing.latest = surgery.created_at;
        }
      } else {
        map.set(key, {
          value,
          count: 1,
          latest: surgery.created_at,
          favorite: favoriteSet.has(key)
        });
      }
    }
  }

  return Array.from(map.values()).sort((a, b) => {
    if (a.favorite !== b.favorite) return a.favorite ? -1 : 1;
    if (a.count !== b.count) return b.count - a.count;
    return b.latest.localeCompare(a.latest);
  });
}

function splitSuggestionValue(value: string) {
  return value
    .split(/\n|;/)
    .map((part) => part.trim())
    .filter((part) => part.length > 1);
}

function normalize(value: string) {
  return value.trim().toLowerCase();
}
