"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateNetlifyToml = exports.writeFile = void 0;
const fs = __importStar(require("fs"));
const sh = __importStar(require("shelljs"));
sh.config.silent = true;
function writeFile(folder, filename, contents) {
    if (!fs.existsSync(folder)) {
        sh.mkdir(folder);
    }
    return fs.writeFileSync(folder + "/" + filename, contents);
}
exports.writeFile = writeFile;
const netlifyToml = `#
# The following redirect is intended for use with most SPAs that handle
# routing internally.
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  # Define which paths this specific [[headers]] block will cover.
  for = "/*"
    [headers.values]
    Access-Control-Allow-Origin = "*"
`;
function redirectHtmlFile() {
    const netlifyHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title> Tutors Reader </title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
      </head>
      <body>
        <script>
          const host = window.location.host;
          const subdomain = host.split('.')[0];
          window.location = "https://reader.tutors.dev/course/" + subdomain;
        </script>
      </body>
    </html>`;
    return netlifyHtml;
}
function generateNetlifyToml(site) {
    writeFile(site, "netlify.toml", netlifyToml);
    writeFile(site, "index.html", redirectHtmlFile());
}
exports.generateNetlifyToml = generateNetlifyToml;
//# sourceMappingURL=netlify.js.map