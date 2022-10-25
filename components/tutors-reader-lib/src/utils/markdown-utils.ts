import showdown from "showdown";
import showdownHighlight from "showdown-highlight";
import showdownKatex from "showdown-katex";
import customClassExt from "showdown-custom-class";

const converter = new showdown.Converter({
  tables: true,
  emoji: true,
  openLinksInNewWindow: true,
  extensions: [
    showdownHighlight,
    customClassExt,
    showdownKatex({
      // maybe you want katex to throwOnError
      throwOnError: false,
      // disable displayMode
      displayMode: false,
      // change errorColor to blue
      errorColor: "red",
    }),
  ],
});

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
