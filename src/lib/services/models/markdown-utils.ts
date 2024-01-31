import hljs from "highlight.js";
import type { Lab, Lo } from "./lo-types";
import MarkdownIt from "markdown-it";
// @ts-ignore
import latex from "@iktakahiro/markdown-it-katex";
import anchor from "markdown-it-anchor";
// @ts-ignore
import toc from "markdown-it-table-of-contents";

import { full as emoji } from "markdown-it-emoji";
// @ts-ignore
import sub from "markdown-it-sub";
// @ts-ignore
import sup from "markdown-it-sup";
// @ts-ignore
import mark from "markdown-it-mark";
// @ts-ignore
import footnote from "markdown-it-footnote";
// @ts-ignore
import deflist from "markdown-it-deflist";
import type { Course } from "./lo-types";

const markdownIt: any = new MarkdownIt({
  html: true, // Enable HTML tags in source
  xhtmlOut: false, // Use '/' to close single tags (<br />).
  breaks: false, // Convert '\n' in paragraphs into <br>
  langPrefix: "language-", // CSS language prefix for fenced blocks. Can be
  linkify: false, // Autoconvert URL-like text to links
  typographer: true,
  quotes: "“”‘’",
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return '<pre class="hljs"><code>' + hljs.highlight(str, { language: lang, ignoreIllegals: true }).value + "</code></pre>";
      } catch (__) {}
    }
    return '<pre class="hljs"><code>' + markdownIt.utils.escapeHtml(str) + "</code></pre>";
  }
});

const tocOptions = { includeLevel: [1, 2, 3] };
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

var defaultRender =
  markdownIt.renderer.rules.link_open ||
  function (tokens: any, idx: any, options: any, env: any, self: any) {
    return self.renderToken(tokens, idx, options);
  };
markdownIt.renderer.rules.link_open = function (tokens: any, idx: any, options: any, env: any, self: any) {
  // If you are sure other plugins can't add `target` - drop check below
  var aIndex = tokens[idx].attrIndex("target");
  if (aIndex < 0) {
    if (tokens[idx]?.attrs.length > 0 && tokens[idx].attrs[0][1] === "header-anchor") {
      // do not set target in anchor tags
    } else {
      tokens[idx].attrPush(["target", "_blank"]); // add new attribute
    }
  } else {
    tokens[idx].attrs[aIndex][1] = "_blank"; // replace value of existing attr
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
  filtered = replaceAll(filtered, "\\]\\(\\#", `](https://${url}#/`);
  return filtered;
}

export function convertLabToHtml(course: Course, lab: Lab) {
  lab.summary = markdownIt.render(lab.summary);
  const url = lab.route.replace(`/lab/${course.courseId}`, course.courseUrl);
  lab.los.forEach((step) => {
    if (course.courseUrl) {
      step.contentMd = filter(step.contentMd, url);
    }
    step.contentHtml = markdownIt.render(step.contentMd);
    step.parentLo = lab;
    step.type = "step";
  });
}

export function convertLoToHtml(course: Course, lo: Lo) {
  if (lo.type === "lab") {
    convertLabToHtml(course, lo as Lab);
  } else {
    if (lo.summary) lo.summary = markdownIt.render(lo.summary);
    let md = lo.contentMd;
    if (md) {
      if (course.courseUrl) {
        const url = lo.route.replace(`/${lo.type}/${course.courseId}`, course.courseUrl);
        md = filter(md, url);
      }
      lo.contentHtml = markdownIt.render(md);
    }
  }
}

export function convertMdToHtml(md: string): string {
  return markdownIt.render(md);
}
