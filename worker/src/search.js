export function normalize(value) {
  return String(value ?? "").toLowerCase();
}

function matchesQuery(fields, q) {
  if (!q) return true;
  const haystack = fields.map(normalize).join(" ");
  return q.split(/\s+/).every((word) => haystack.includes(word));
}

export function publicEntry(entry, origin = "") {
  const { prompt: _prompt, ...rest } = entry;
  return {
    ...rest,
    prompt_path: entry.path ? entry.path.replace(/entry\.md$/, "prompt.md") : "",
    prompt_url: origin ? `${origin}/api/entries/${entry.id}/prompt` : `/api/entries/${entry.id}/prompt`,
  };
}

export function getEntry(entries, id) {
  return entries.find((entry) => entry.id === id) || null;
}

export function filterEntries(entries, params = {}) {
  const q = normalize(params.q).trim();
  const tier = normalize(params.tier);
  const type = normalize(params.type);
  const tag = normalize(params.tag);
  const demo = normalize(params.demo);
  const limit = Math.min(Math.max(Number(params.limit) || 100, 1), 500);

  const matches = entries.filter((entry) => {
    if (tier && normalize(entry.tier) !== tier) return false;
    if (type && normalize(entry.type) !== type) return false;
    if (demo && normalize(entry.demo || "none") !== demo) return false;
    if (tag && !entry.tags.some((item) => normalize(item) === tag)) return false;
    return matchesQuery([entry.id, entry.title, entry.summary, entry.source_author, entry.type, ...entry.tags], q);
  });

  return { total: matches.length, entries: matches.slice(0, limit) };
}

export function filterComponents(upstream, params = {}) {
  const q = normalize(params.q).trim();
  const libraryId = normalize(params.library);
  const limit = Math.min(Math.max(Number(params.limit) || 50, 1), 500);
  const components = [];

  for (const lib of upstream) {
    if (libraryId && normalize(lib.id) !== libraryId) continue;
    for (const component of lib.components) {
      const row = {
        id: component.name,
        library: lib.library,
        library_id: lib.id,
        category: component.category,
        install: lib.install,
        repo: lib.repo,
        license: lib.license,
        rights: lib.rights,
      };
      if (!matchesQuery([row.id, row.library, row.category], q)) continue;
      components.push(row);
    }
  }

  return { total: components.length, components: components.slice(0, limit) };
}
