import showdown from "showdown";
import showdownHighlight from "showdown-highlight";
import { showdownCopyCode } from "showdown-copy-code";
import customClassExt from "showdown-custom-class";
import { generateToc } from "./markdown-toc-lib";

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

let richConverter: any;

export async function initKaytex() {
  const kaytex = await import("showdown-katex");
  let showdownConverter = new showdown.Converter({
    tables: true,
    emoji: true,
    openLinksInNewWindow: true,
    extensions: [
      showdownHighlight,
      customClassExt,
      showdownCopyCode,
      kaytex.default({
        throwOnError: false,
        displayMode: true,
        errorColor: "red"
      })
    ]
  });
  richConverter = showdownConverter;
}

function replaceAll(str: string, find: string, replace: string) {
  return str.replace(new RegExp(find, "g"), replace);
}

function filter(src: string, url: string): string {
  let filtered = replaceAll(src, "./img\\/", `img/`);
  filtered = replaceAll(filtered, "img\\/", `https://${url}/img/`);
  filtered = replaceAll(filtered, "./archives\\/", `archives/`);
  filtered = replaceAll(filtered, "archives\\/", `https://${url}/archives/`);
  filtered = replaceAll(filtered, "./archive\\/", `archive/`);
  filtered = replaceAll(filtered, "archive\\/", `https://${url}/archive/`);
  filtered = replaceAll(filtered, "\\]\\(\\#", `](https://${url}#/`);
  return filtered;
}

export function convertMd(md: string, url: string): string {
  let html = "";
  if (md) {
    md = filter(md, url);
    html = converter.makeHtml(md);
    html = generateToc(html);
  }
  return html;
}

export function convertRichMd(md: string, url: string): string {
  let html = "";
  if (md) {
    md = filter(md, url);
    if (richConverter) {
      html = richConverter.makeHtml(md);
    }
  }
  return html;
}