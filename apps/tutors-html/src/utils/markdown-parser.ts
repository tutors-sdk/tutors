import * as showdown from "showdown";
import showdownHighlight from "showdown-highlight";

const converter = new showdown.Converter({ tables: true, openLinksInNewWindow: true, extensions: [showdownHighlight] });
export class MarkdownParser {
  parse(md: string): string {
    return converter.makeHtml(md);
  }
}
