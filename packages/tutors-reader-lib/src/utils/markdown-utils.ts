import type { ConvertMdToHtml } from "src/types/md-types";
import showdown from "showdown";
import showdownHighlight from "showdown-highlight";
import { showdownCopyCode } from "showdown-copy-code";
import customClassExt from "showdown-custom-class";

let converter = new showdown.Converter({
  tables: true,
  emoji: true,
  openLinksInNewWindow: true,
  extensions: [
    showdownHighlight,
    customClassExt,
    showdownCopyCode
  ]
});

let richConverter: ConvertMdToHtml = null;

export function initRichConverter(converterFunction: ConvertMdToHtml) {
  richConverter = converterFunction;
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
    html = converter.makeHtml(filtered);
  }
  return html;
}

export function convertRichMd(md: string, url: string): string {
  let html = "";
  if (md) {
    let filtered = replaceAll(md, "./img\\/", `img/`);
    filtered = replaceAll(filtered, "img\\/", `https://${url}/img/`);
    filtered = replaceAll(filtered, "./archives\\/", `archives/`);
    filtered = replaceAll(filtered, "archives\\/", `https://${url}/archives/`);
    filtered = replaceAll(filtered, "./archive\\/", `archive/`);
    filtered = replaceAll(filtered, "archive\\/", `https://${url}/archive/`);
    filtered = replaceAll(filtered, "\\]\\(\\#", `](https://${url}#/`);
    if (richConverter) {
      html = richConverter(filtered);
    }
  }
  return html;
}
