import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
const files = execFileSync("git", ["ls-files", "--cached", "--others", "--exclude-standard", "-z"], { encoding: "utf8" }).split("\0").filter(Boolean);
let failures = 0;
const patterns = [/\bgh[pousr]_[A-Za-z0-9]{20,}\b/, /\bgithub_pat_[A-Za-z0-9_]{30,}\b/, /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/, /CURRENTS_API_KEY[ \t]*=[ \t]*["']?[A-Za-z0-9_-]{12,}/];
let privateKey = process.env.CURRENTS_API_KEY;
try {
  privateKey ||= readFileSync(".env.local", "utf8").match(/^CURRENTS_API_KEY[ \t]*=[ \t]*["']?([^\s"'#]+)/m)?.[1];
} catch { /* no local key */ }
function scan(path) {
  if (/\.(png|jpg|jpeg|webp|ico|woff2?)$/.test(path)) return;
  const content = readFileSync(path, "utf8");
  if (patterns.some((pattern) => pattern.test(content)) || (privateKey && content.includes(privateKey))) { console.error(`Possible secret in ${path}; value withheld.`); failures++; }
}
for (const file of files) {
  if (/(^|\/)\.env(\.|$)/.test(file) && file !== ".env.example") { console.error(`Real environment file would be published: ${file}`); failures++; }
  scan(file);
}
function scanDirectory(directory) {
  for (const entry of readdirSync(directory)) {
    const path = join(directory, entry);
    if (statSync(path).isDirectory()) scanDirectory(path); else scan(path);
  }
}
try { scanDirectory(".next/static"); } catch { /* build may not exist yet */ }
if (failures) process.exit(1);
console.log(`Secret scan passed for ${files.length} publishable files and available browser build assets. Pattern scanning is not a proof that all secrets are absent.`);
