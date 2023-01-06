import * as fs from "fs";
import * as sh from "shelljs";
sh.config.silent = true;

export function writeFile(folder: string, filename: string, contents: string): void {
  if (!fs.existsSync(folder)) {
    sh.mkdir(folder);
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
          var domain = window.location.hostname.substring(window.location.hostname.lastIndexOf(".", window.location.hostname.lastIndexOf(".") - 1) + 1);
          var url = window.location.href;
          var baseUrl = url.substring(url.indexOf('//') + 2);
          var array = baseUrl.split('/');
          array.pop();
          var tutorsUrl = array.join('/');
          window.location = "https://reader.tutors.dev" + "/#/course/" + tutorsUrl;
          // const host = window.location.host;
          // const subdomain = host.split('.')[0];
          // window.location = "https://reader.tutors.dev/course/" + subdomain;
        </script>
      </body>
    </html>`;
  return netlifyHtml;
}

export function generateNetlifyToml(site: string) {
  writeFile(site, "netlify.toml", netlifyToml);
  writeFile(site, "index.html", redirectHtmlFile());
}
