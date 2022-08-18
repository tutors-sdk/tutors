"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarkdownParser = void 0;
const showdown = require('showdown');
const showdownHighlight = require('showdown-highlight');
let converter = new showdown.Converter({ tables: true, openLinksInNewWindow: true, extensions: [showdownHighlight] });
class MarkdownParser {
    parse(md) {
        return converter.makeHtml(md);
    }
}
exports.MarkdownParser = MarkdownParser;
//# sourceMappingURL=markdown-parser.js.map