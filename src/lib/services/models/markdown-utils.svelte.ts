/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { Lab, Lo } from "./lo-types";
// @ts-ignore
import MarkdownIt from "markdown-it";
// @ts-ignore
import latex from "@iktakahiro/markdown-it-katex";
// @ts-ignore
import anchor from "markdown-it-anchor";
// @ts-ignore
import toc from "markdown-it-table-of-contents";
// @ts-ignore
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

import { bundledLanguages, createHighlighter } from "shiki";

let highlighter: any;

export async function initializeHighlighter() {
  highlighter = await createHighlighter({
    themes: ["monokai", "night-owl", "github-dark", "catppuccin-mocha", "solarized-dark", "solarized-light"],
    langs: Object.keys(bundledLanguages)
  });
}

let currentTheme = "monokai";

const markdownIt: any = new MarkdownIt({
  html: true, // Enable HTML tags in source
  xhtmlOut: false, // Use '/' to close single tags (<br />).
  breaks: false, // Convert '\n' in paragraphs into <br>
  langPrefix: "language-", // CSS language prefix for fenced blocks. Can be
  linkify: false, // Autoconvert URL-like text to links
  typographer: true,
  quotes: "“”‘’",
  highlight: function (str: string, lang: string) {
    return highlighter?.codeToHtml(str, { lang, theme: currentTheme });
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

// @ts-ignore
const defaultRender =
  markdownIt.renderer.rules.link_open ||
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function (tokens: any, idx: any, options: any, env: any, self: any) {
    return self.renderToken(tokens, idx, options);
  };
markdownIt.renderer.rules.link_open = function (tokens: any, idx: any, options: any, env: any, self: any) {
  // If you are sure other plugins can't add `target` - drop check below
  const aIndex = tokens[idx].attrIndex("target");
  if (aIndex < 0) {
    if (tokens[idx]?.attrs.length > 0 && tokens[idx].attrs[0][1] === "header-anchor") {
      // do not set target in anchor tags
    } else {
      if (!tokens[idx].attrs[0][1].startsWith("/lab")) {
        // as long as link it external to this lab, open in a new page
        tokens[idx].attrPush(["target", "_blank"]); // add new attribute
      }
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

  //filtered = replaceAll(filtered, "archives\\/", `https://${url}/archives/`);
  filtered = replaceAll(filtered, "(?<!/)archives\\/", `https://${url}/archives/`);

  // filtered = replaceAll(filtered, "./archive\\/(?!refs)", `archive/`);
  filtered = replaceAll(filtered, "(?<!/)archive\\/(?!refs)", `https://${url}/archive/`);
  filtered = replaceAll(filtered, "\\]\\(\\#", `](https://${url}#/`);
  return filtered;
}

export async function convertLabToHtml(course: Course, lab: Lab, theme: string) {
  if (!highlighter) {
    await initializeHighlighter();
  }
  currentTheme = theme;
  lab.summary = markdownIt.render(lab.summary);
  const url = lab.route.replace(`/lab/${course.courseId}`, course.courseUrl);
  lab?.los?.forEach((step) => {
    if (course.courseUrl) {
      step.contentMd = filter(step.contentMd, url);
    }
    step.contentHtml = markdownIt.render(step.contentMd);
    step.parentLo = lab;
    step.type = "step";
  });
}

export async function convertLoToHtml(course: Course, lo: Lo, theme: string) {
  currentTheme = theme;
  if (lo.type === "lab") {
    // convertLabToHtml(course, lo as Lab);
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
