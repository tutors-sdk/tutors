"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertMdToHtml = void 0;
const highlight_js_1 = __importDefault(require("highlight.js"));
const markdown_it_1 = __importDefault(require("markdown-it"));
const markdown_it_katex_1 = __importDefault(require("@iktakahiro/markdown-it-katex"));
const markdown_it_anchor_1 = __importDefault(require("markdown-it-anchor"));
const markdown_it_table_of_contents_1 = __importDefault(require("markdown-it-table-of-contents"));
const markdown_it_emoji_1 = __importDefault(require("markdown-it-emoji"));
const markdown_it_sub_1 = __importDefault(require("markdown-it-sub"));
const markdown_it_sup_1 = __importDefault(require("markdown-it-sup"));
const markdown_it_mark_1 = __importDefault(require("markdown-it-mark"));
const markdown_it_footnote_1 = __importDefault(require("markdown-it-footnote"));
const markdown_it_deflist_1 = __importDefault(require("markdown-it-deflist"));
const markdownIt = new markdown_it_1.default({
    html: false,
    xhtmlOut: false,
    breaks: false,
    langPrefix: "language-",
    linkify: false,
    typographer: true,
    quotes: "“”‘’",
    highlight: function (str, lang) {
        if (lang && highlight_js_1.default.getLanguage(lang)) {
            try {
                return '<pre class="hljs"><code>' + highlight_js_1.default.highlight(str, { language: lang, ignoreIllegals: true }).value + "</code></pre>";
            }
            catch (__) { }
        }
        return '<pre class="hljs"><code>' + markdownIt.utils.escapeHtml(str) + "</code></pre>";
    },
});
const tocOptions = { includeLevel: [1, 2, 3] };
markdownIt.use(markdown_it_katex_1.default);
markdownIt.use(markdown_it_anchor_1.default, {
    permalink: markdown_it_anchor_1.default.permalink.headerLink(),
});
markdownIt.use(markdown_it_table_of_contents_1.default, tocOptions);
markdownIt.use(markdown_it_emoji_1.default);
markdownIt.use(markdown_it_sub_1.default);
markdownIt.use(markdown_it_sup_1.default);
markdownIt.use(markdown_it_mark_1.default);
markdownIt.use(markdown_it_footnote_1.default);
markdownIt.use(markdown_it_deflist_1.default);
function convertMdToHtml(md) {
    return markdownIt.render(md);
}
exports.convertMdToHtml = convertMdToHtml;
//# sourceMappingURL=markdown.js.map