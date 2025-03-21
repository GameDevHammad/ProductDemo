const express = require("express");
const path = require("path");
const compression = require("compression");

const app = express();
const PORT = 5500;

// Enable Gzip compression
app.use(compression());

// Serve static files from public
app.use(express.static(path.join(__dirname, "public"), {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith(".unityweb") || filePath.endsWith(".loader.js")) {
        res.setHeader("Content-Encoding", "gzip");
        res.setHeader("Content-Type", "application/octet-stream");
      } else if (filePath.endsWith(".js")) {
        res.setHeader("Content-Encoding", "gzip");
        res.setHeader("Content-Type", "application/javascript");
      }
    }
  }));

// Serve Unity WebGL files
const buildPath = path.join(__dirname, "Build");
app.use("/Build", express.static(buildPath, { setHeaders: setCustomHeaders }));

// Custom headers for Gzip files
function setCustomHeaders(res, filePath) {
  if (filePath.endsWith(".gz")) {
    res.setHeader("Content-Encoding", "gzip");
    res.setHeader("Content-Type", getMimeType(filePath));
  }
}

function getMimeType(filePath) {
  if (filePath.endsWith(".js.gz")) return "application/javascript";
  if (filePath.endsWith(".wasm.gz")) return "application/wasm";
  if (filePath.endsWith(".data.gz")) return "application/octet-stream";
  return "application/octet-stream";
}

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
