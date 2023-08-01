import hljs from 'highlight.js'
import MarkdownIt from 'markdown-it';
import latex from '@iktakahiro/markdown-it-katex';
import anchor from "markdown-it-anchor";
import toc from "markdown-it-table-of-contents";
import emoji from "markdown-it-emoji";
import sub from "markdown-it-sub";
import sup from "markdown-it-sup";
import mark from "markdown-it-mark";
import footnote from "markdown-it-footnote";
import deflist from "markdown-it-deflist";

const markdownIt: any = new MarkdownIt({
    html: false,        // Enable HTML tags in source
    xhtmlOut: false,        // Use '/' to close single tags (<br />).
    breaks: false,        // Convert '\n' in paragraphs into <br>
    langPrefix: 'language-',  // CSS language prefix for fenced blocks. Can be
    linkify: false,        // Autoconvert URL-like text to links
    typographer: true,
    quotes: '“”‘’',
    highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return '<pre class="hljs"><code>' +
                    hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
                    '</code></pre>';
            } catch (__) { }
        }
        return '<pre class="hljs"><code>' + markdownIt.utils.escapeHtml(str) + '</code></pre>';
    }
});

const tocOptions = { "includeLevel": [1, 2, 3] };
markdownIt.use(latex);
markdownIt.use(anchor, {
    permalink: anchor.permalink.headerLink()
});

markdownIt.use(toc, tocOptions);
markdownIt.use(emoji);
markdownIt.use(sub);
markdownIt.use(sup);
markdownIt.use(mark);
markdownIt.use(footnote);
markdownIt.use(deflist);

export function convertMdToHtml(md: string): string {
    return markdownIt.render(md);
}


