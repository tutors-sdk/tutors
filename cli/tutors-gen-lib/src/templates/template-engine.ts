import * as fs from "node:fs";
import * as path from "node:path";
import { getIconColour, getIconType } from "./styles.ts";
import vento from "@vento/vento";
import process from "node:process";

// Get current module directory
const moduleDir = path.dirname(new URL(import.meta.url).pathname);
const ventoDir = path.join(moduleDir, 'vento');

console.log('Module dir:', moduleDir);
console.log('Vento dir:', ventoDir);

const env = vento({
  dataVarname: "it",
  autoDataVarname: true,
  includes: `${process.cwd()}/html/vento`,
  autoescape: false
});
env.filters.iconType = getIconType;
env.filters.iconColour = getIconColour;

function writeFile(
    folder: string,
    filename: string,
    contents: string,
  ): void {
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }
    return fs.writeFileSync(folder + "/" + filename, contents);
  }

export async function publishTemplate(path: string, file: string, template: string, lo: any) {
  const result = await env.run(`${template}.vto`, { lo: lo });
  writeFile(path, file, result.content);
}
