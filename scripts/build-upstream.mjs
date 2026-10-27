import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const upstreamDir = join(root, "_private", "upstream");

const LIBRARIES = [
  {
    id: "shadcn-ui",
    library: "shadcn/ui",
    repo: "https://github.com/shadcn-ui/ui",
    source_url: "https://ui.shadcn.com",
    commit: "96da9cc7f1aa10580a3741664e2a77c721206c00",
    license: "MIT",
    install: "npx shadcn@latest add <name>",
    docLink: (name) => `https://ui.shadcn.com/docs/components/${name}`,
    installFor: (name) => `npx shadcn@latest add ${name}`,
    categories: [{ name: "ui", file: "shadcn.txt" }],
  },
  {
    id: "magic-ui",
    library: "Magic UI",
    repo: "https://github.com/magicuidesign/magicui",
    source_url: "https://magicui.design",
    commit: "efe76fc5755eca1142dd4f74c1d6f0ace2887e3c",
    license: "MIT",
    install: "npx shadcn@latest add @magicui/<name>",
    docLink: (name) => `https://magicui.design/docs/components/${name}`,
    installFor: (name) => `npx shadcn@latest add @magicui/${name}`,
    categories: [{ name: "ui", file: "magicui-ui.txt" }],
  },
  {
    id: "react-bits",
    library: "React Bits",
    repo: "https://github.com/DavidHDev/react-bits",
    source_url: "https://reactbits.dev",
    commit: "e12c22192ac7b4b452c5e2feb9b586d74765d696",
    license: "MIT + Commons Clause",
    install: "npx shadcn@latest add @react-bits/<Name>-TS-TW",
    docLink: (_name, category) => `https://github.com/DavidHDev/react-bits/tree/e12c22192ac7b4b452c5e2feb9b586d74765d696/src/ts-tailwind/${category}`,
    installFor: (name) => `npx shadcn@latest add @react-bits/${name}-TS-TW`,
    categories: ["Animations", "Backgrounds", "Components", "Micro", "TextAnimations"].map((category) => ({
      name: category,
      file: `rb-${category}.txt`,
    })),
  },
];

function readList(file) {
  return readFileSync(join(upstreamDir, file), "utf8")
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

for (const library of LIBRARIES) {
  const categories = {};
  for (const category of library.categories) {
    categories[category.name] = readList(category.file).sort((a, b) => a.localeCompare(b));
  }

  const total = Object.values(categories).reduce((sum, names) => sum + names.length, 0);
  const dir = join(root, "sources", library.id);
  mkdirSync(dir, { recursive: true });

  writeFileSync(
    join(dir, "components.json"),
    JSON.stringify(
      {
        library: library.library,
        repo: library.repo,
        commit: library.commit,
        source_url: library.source_url,
        license: library.license,
        install: library.install,
        categories,
      },
      null,
      2
    ) + "\n"
  );

  const lines = [
    `# ${library.library} component index`,
    "",
    `${total} components, pinned to commit [\`${library.commit.slice(0, 7)}\`](${library.repo}/tree/${library.commit}). License: ${library.license}.`,
    "",
    "Install one:",
    "",
    "```bash",
    library.install,
    "```",
    "",
    "| Component | Category | Install | Source |",
    "| --- | --- | --- | --- |",
  ];

  for (const [category, names] of Object.entries(categories)) {
    for (const name of names) {
      lines.push(`| ${name} | ${category} | \`${library.installFor(name)}\` | [link](${library.docLink(name, category)}) |`);
    }
  }

  lines.push(
    "",
    `This index is generated from the upstream repository. No component source is hosted in this vault. See [entry.md](entry.md) for license and usage terms.`,
    ""
  );

  writeFileSync(join(dir, "components.md"), lines.join("\n"));
  console.log(`${library.library}: ${total} components`);
}
