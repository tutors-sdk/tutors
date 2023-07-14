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
import container from "markdown-it-container";
import type { Lab } from 'tutors-reader-lib/src/models/lab';
import { removeLeadingHashes } from 'tutors-reader-lib/src/utils/lo-utils';

const markdownIt: any = new MarkdownIt({
    html: false,        // Enable HTML tags in source
    xhtmlOut: false,        // Use '/' to close single tags (<br />).
    breaks: false,        // Convert '\n' in paragraphs into <br>
    langPrefix: 'language-',  // CSS language prefix for fenced blocks. Can be
    linkify: true,        // Autoconvert URL-like text to links
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
markdownIt.use(anchor);
markdownIt.use(toc, tocOptions);
markdownIt.use(emoji);
markdownIt.use(sub);
markdownIt.use(sup);
markdownIt.use(mark);
markdownIt.use(footnote);
markdownIt.use(deflist);
markdownIt.use(container);

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
    let loPath = lo.route.replace("/panelnote/", "");
    loPath = loPath.replace("/note/", "");
    const course = get(currentCourse)
    loPath = loPath.replace(course.id, course.url);

    if (!lo.contentHtml) {
        lo.contentHtml = convertMdToHtml(lo.contentMd, loPath);
    }
}

export function convertLabMdToHtml(lab: Lab) {
    const assetUrl = lab.url.replace(`/lab/${lab.course.id}`, lab.course.url);
    lab.objectivesHtml = convertMdToHtml(lab.lo.los[0].contentMd, assetUrl);
    lab.lo.los.forEach((chapter) => {
        lab.chaptersHtml.set(encodeURI(chapter.shortTitle), convertMdToHtml(chapter.contentMd, assetUrl));
        lab.chaptersTitles.set(chapter.shortTitle, removeLeadingHashes(chapter.title));
    });
    lab.steps = Array.from(lab.chaptersHtml.keys());
}
