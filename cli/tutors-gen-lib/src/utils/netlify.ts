import * as fs from "node:fs";

export function writeFile(
  folder: string,
  filename: string,
  contents: string,
): void {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder);
  }
  return fs.writeFileSync(folder + "/" + filename, contents);
}

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

function redirectHtmlFile(): string {
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
          window.location = "https://tutors.dev/course/" + subdomain;
        </script>
      </body>
    </html>`;
  return netlifyHtml;
}

export function generateNetlifyToml(site: string) {
  writeFile(site, "netlify.toml", netlifyToml);
  writeFile(site, "index.html", redirectHtmlFile());
}
