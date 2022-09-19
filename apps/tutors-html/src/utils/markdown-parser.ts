const showdown = require('showdown');
const showdownHighlight = require('showdown-highlight');

let converter = new showdown.Converter({ tables: true, openLinksInNewWindow: true, extensions: [showdownHighlight] });

export class MarkdownParser {
  parse(md: string): string {
    return converter.makeHtml(md);
  }
}
