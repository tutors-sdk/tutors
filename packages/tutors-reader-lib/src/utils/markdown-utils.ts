import type { ConvertMdToHtml } from "src/types/md-types";

let converter: ConvertMdToHtml = null;

export function initConverter(converterFunction: ConvertMdToHtml) {
  converter = converterFunction;
}

function replaceAll(str: string, find: string, replace: string) {
  return str.replace(new RegExp(find, "g"), replace);
}

export function convertMd(md: string, url: string): string {
  let html = "";
  if (md) {
    let filtered = replaceAll(md, "./img\\/", `img/`);
    filtered = replaceAll(filtered, "img\\/", `https://${url}/img/`);
    filtered = replaceAll(filtered, "./archives\\/", `archives/`);
    filtered = replaceAll(filtered, "archives\\/", `https://${url}/archives/`);
    filtered = replaceAll(filtered, "./archive\\/", `archive/`);
    filtered = replaceAll(filtered, "archive\\/", `https://${url}/archive/`);
    filtered = replaceAll(filtered, "\\]\\(\\#", `](https://${url}#/`);
    if (converter) {
      html = converter(filtered);
    }
  }
  return html;
}
