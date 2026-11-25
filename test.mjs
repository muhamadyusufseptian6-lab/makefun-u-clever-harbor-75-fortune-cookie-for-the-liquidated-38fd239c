// TDD-lite test for the fortune cookie entry (Node stdlib only).
// Run: node test.mjs <output-dir> — checks the entry.txt main.ts produced.
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const outDir = process.argv[2] ?? "/tmp/fortune-cookie-test-out";
const entryPath = join(outDir, "entry.txt");

let failures = 0;
function check(name, ok, detail = "") {
  console.log(`${ok ? "PASS" : "FAIL"} ${name}${detail ? " — " + detail : ""}`);
  if (!ok) failures++;
}

check("entry.txt exists", existsSync(entryPath));
if (!existsSync(entryPath)) {
  console.log(`${failures} failure(s)`);
  process.exit(1);
}

const text = readFileSync(entryPath, "utf8");
const trimmed = text.trim();
check("entry is UTF-8 text, 1-160 chars", trimmed.length >= 1 && trimmed.length <= 160, `${trimmed.length} chars`);
check("entry is not only whitespace", trimmed.length > 0);
check("entry is at most 20 words", trimmed.split(/\s+/).length <= 20, `${trimmed.split(/\s+/).length} words`);
check("entry is a single line", !trimmed.includes("\n"));
check("entry has no trailing newline issues (single line only)", text === trimmed || text === trimmed + "\n");

// Determinism: run main.ts twice into two dirs and compare.
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
const a = mkdtempSync(join(tmpdir(), "fc-a-"));
const b = mkdtempSync(join(tmpdir(), "fc-b-"));
execFileSync(process.execPath, ["main.ts"], { cwd: new URL(".", import.meta.url).pathname, env: { ...process.env, MAKEFUN_OUTPUT_DIR: a } });
execFileSync(process.execPath, ["main.ts"], { cwd: new URL(".", import.meta.url).pathname, env: { ...process.env, MAKEFUN_OUTPUT_DIR: b } });
const ta = readFileSync(join(a, "entry.txt"), "utf8");
const tb = readFileSync(join(b, "entry.txt"), "utf8");
check("deterministic: two runs produce identical entry.txt", ta === tb);
rmSync(a, { recursive: true, force: true });
rmSync(b, { recursive: true, force: true });

// Stdlib-only: main.ts must import only node:* modules.
const mainSrc = readFileSync(new URL("./main.ts", import.meta.url), "utf8");
const imports = [...mainSrc.matchAll(/from\s+["']([^"']+)["']/g)].map((m) => m[1]);
const nonStd = imports.filter((i) => !i.startsWith("node:"));
check("stdlib-only imports", nonStd.length === 0, nonStd.length ? `non-stdlib: ${nonStd.join(", ")}` : `imports: ${imports.join(", ")}`);

console.log(failures === 0 ? "ALL TESTS PASSED" : `${failures} failure(s)`);
process.exit(failures === 0 ? 0 : 1);
