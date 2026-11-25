// Fortune Cookie for the Liquidated Trader
// make.fun competition: u-clever-harbor-75-fortune-cookie-for-the-liquidated-38fd239c
//
// One fortune cookie line for a crypto trader who just got liquidated.
// The stars are the fortune-teller here: they solemnly advise the trader
// to sell everything — three hours after the liquidation already sold it
// all for him. Oracular voice up front, punchline breaks it at the end.
//
// Deterministic, stdlib-only. Writes the entry to $MAKEFUN_OUTPUT_DIR/entry.txt
// (falls back to /output). Resolves paths from this script's location,
// never from process.cwd().
import { writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ENTRY =
  "The stars advise you to sell everything — they are three hours too late.";

const repoDir = dirname(fileURLToPath(import.meta.url));
void repoDir;

const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outputDir, { recursive: true });
writeFileSync(join(outputDir, "entry.txt"), ENTRY + "\n", "utf8");
