import hljs from 'highlight.js'
import type { Lo } from "tutors-reader-lib/src/types/lo-types";
import { currentCourse } from "tutors-reader-lib/src/stores/stores";
import { get } from 'svelte/store'
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

var defaultRender = markdownIt.renderer.rules.link_open || function (tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options);
};
markdownIt.renderer.rules.link_open = function (tokens, idx, options, env, self) {
    // If you are sure other plugins can't add `target` - drop check below
    var aIndex = tokens[idx].attrIndex('target');
    if (aIndex < 0) {
        if ((tokens[idx]?.attrs.length > 0) && (tokens[idx].attrs[0][1] === "header-anchor")) {
            ; // do not set target in anchor tags
        } else {
            tokens[idx].attrPush(['target', '_blank']); // add new attribute
        }
    } else {
        tokens[idx].attrs[aIndex][1] = '_blank';    // replace value of existing attr
    }
    // pass token to default renderer.
    return defaultRender(tokens, idx, options, env, self);
};


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

export function convertMdToHtml(md: string, url: string): string {
    const mdFiltered = filter(md, url);
    return markdownIt.render(mdFiltered);
}

export function convertNoteMdToHtml(lo: Lo) {
    if (!lo.contentHtml) {
        let loPath = lo.route.replace("/panelnote/", "");
        loPath = loPath.replace("/note/", "");
        const course = get(currentCourse)
        loPath = loPath.replace(course.id, course.url);
        lo.contentHtml = convertMdToHtml(lo.contentMd, loPath);
    }
}

