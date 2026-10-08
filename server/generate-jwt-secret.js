import { randomBytes } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const envPath = fileURLToPath(new URL("./.env", import.meta.url));
let envContents = "";

try {
  envContents = readFileSync(envPath, "utf8");
} catch (error) {
  if (error.code !== "ENOENT") {
    throw error;
  }
}

const secret = randomBytes(64).toString("hex");
const assignment = `JWT_SECRET=${secret}`;
const secretPattern = /^JWT_SECRET=.*$/m;

if (secretPattern.test(envContents)) {
  envContents = envContents.replace(secretPattern, assignment);
} else {
  const lineEnding = envContents.includes("\r\n") ? "\r\n" : "\n";
  const separator = envContents && !envContents.endsWith("\n") ? lineEnding : "";
  envContents = `${envContents}${separator}${assignment}${lineEnding}`;
}

writeFileSync(envPath, envContents, { encoding: "utf8", mode: 0o600 });
console.log("Generated JWT_SECRET in .env.");