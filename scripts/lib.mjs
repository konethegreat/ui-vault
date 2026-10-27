import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

export const TIERS = {
  references: "reference",
  sources: "source",
  library: "pattern",
};

export function parseFrontmatter(text) {
  const normalized = String(text).replace(/\r\n/g, "\n");
  const match = normalized.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) throw new Error("missing or malformed frontmatter");
  const data = {};
  for (const raw of match[1].split("\n")) {
    const line = raw.trimEnd();
    if (!line.trim() || line.trimStart().startsWith("#")) continue;
    const idx = line.indexOf(":");
    if (idx === -1) throw new Error(`invalid frontmatter line: ${line}`);
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();
    if (value.length >= 2 && value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1);
    }
    if (value === "true") value = true;
    else if (value === "false") value = false;
    data[key] = value;
  }
  return { data, body: match[2].trim() };
}

export function listEntries(root) {
  const out = [];
  for (const [folder, tier] of Object.entries(TIERS)) {
    let dirents;
    try {
      dirents = readdirSync(join(root, folder), { withFileTypes: true });
    } catch {
      continue;
    }
    for (const dirent of dirents) {
      if (!dirent.isDirectory()) continue;
      const dir = join(root, folder, dirent.name);
      let text;
      try {
        text = readFileSync(join(dir, "entry.md"), "utf8");
      } catch {
        continue;
      }
      const { data, body } = parseFrontmatter(text);
      out.push({ folder, tier, id: dirent.name, dir, data, body });
    }
  }
  return out;
}

export function splitList(value) {
  if (Array.isArray(value)) return value;
  if (typeof value !== "string") return [];
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function firstParagraph(body) {
  const buffer = [];
  for (const line of String(body).replace(/\r\n/g, "\n").split("\n")) {
    const text = line.trim();
    if (!text) {
      if (buffer.length) break;
      continue;
    }
    if (text.startsWith("#")) {
      if (buffer.length) break;
      continue;
    }
    buffer.push(text);
  }
  return buffer.join(" ");
}

export function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
