const fs = require("fs");
const path = require("path");

const buildDir = path.join(__dirname, "..", "build");
const targetFile = path.join(buildDir, "config.js");

const backendUrl = process.env.BACKEND_URL || process.env.REACT_APP_BACKEND_URL || "";

if (!fs.existsSync(buildDir)) {
  console.error(
    "[runtime-config] build/ directory not found. Did you run `npm run build`?"
  );
  process.exit(1);
}

const configObject = {
  BACKEND_URL: backendUrl,
};

const content = `window.__APP_CONFIG__ = ${JSON.stringify(configObject)};\n`;

fs.writeFileSync(targetFile, content, "utf8");

console.log("[runtime-config] Wrote", targetFile);
console.log("[runtime-config] BACKEND_URL:", backendUrl || "(empty)");
