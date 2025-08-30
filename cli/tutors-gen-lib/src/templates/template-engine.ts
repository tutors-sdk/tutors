import * as fs from "node:fs";
import * as path from "node:path";
import {  getIconType, loBackgroundColour, loBorderColour } from "./styles.ts";
import vento from "@vento/vento";
import autoTrim from "jsr:@vento/vento@1.14.0/plugins/auto_trim.ts";
import type { Environment } from "@vento/vento/src/environment.ts";
import { generateCrumbLink, generateImg, generateLink, generateRefLink, generateVideoLink, tocLink, wallLink } from "./utils.ts";

const moduleDir = path.dirname(new URL(import.meta.url).pathname);
const ventoDir = path.join(moduleDir, 'vento');

console.log('Module dir:', moduleDir);
console.log('Vento dir:', ventoDir);

let env:Environment;

export function initTemplateEngine(folder:string) {
  env = vento({
    dataVarname: "it",
    autoDataVarname: true,
    includes: `${folder}/vento`,
    autoescape: false
  });
  env.filters.iconType = getIconType;
  env.filters.loBorderColour = loBorderColour;
  env.filters.loBackgroundColour = loBackgroundColour;

  env.filters.generateLink = generateLink;
  env.filters.generateImg = generateImg;
  env.filters.generateRefLink = generateRefLink;
  env.filters.generateCrumbLink =  generateCrumbLink;
  env.filters.wallLink = wallLink;
  env.filters.generateVideoLink = generateVideoLink;
  env.filters.tocLink = tocLink;

  env.use(autoTrim());
}

function writeFile(folder: string, filename: string, contents: string): void {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }
  return fs.writeFileSync(folder + "/" + filename, contents);
}

export async function publishTemplate(path: string, file: string, template: string, lo: any) {
  const result = await env.run(`${template}.vto`, { lo: lo });
  writeFile(path, file, result.content);
}
