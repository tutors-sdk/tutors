import MarkdownIt from "markdown-it";
import latex from "@iktakahiro/markdown-it-katex";
import anchor from "markdown-it-anchor";
import toc from "markdown-it-table-of-contents";
import { full as emoji } from "markdown-it-emoji";
import sub from "markdown-it-sub";
import sup from "markdown-it-sup";
import mark from "markdown-it-mark";
import footnote from "markdown-it-footnote";
import deflist from "markdown-it-deflist";
import { addCopyButton } from "shiki-transformer-copy-button";
import type { Course, Lab, Lo, Note } from "../types/index.ts";

const options = {
  // delay time from "copied" state back to normal state
  toggle: 2000,
};

let currentTheme = "ayu-dark";

let customHighlighter: any;

export function initHighlighter(codeHighlighter: any) {
  customHighlighter = codeHighlighter;
}

export const markdownIt: MarkdownIt = new MarkdownIt({
  html: true, // Enable HTML tags in source
  xhtmlOut: false, // Use '/' to close single tags (<br />).
  breaks: false, // Convert '\n' in paragraphs into <br>
  langPrefix: "language-", // CSS language prefix for fenced blocks. Can be
  linkify: false, // Autoconvert URL-like text to links
  typographer: true,
  quotes: "“”‘’",
  highlight: function (str: string, lang: string) {
    try {
      return customHighlighter?.codeToHtml(str, { lang, theme: currentTheme, transformers: [addCopyButton(options)] });
    } catch (e) {
      return customHighlighter?.codeToHtml(str, {
        lang: "",
        theme: currentTheme,
        transformers: [addCopyButton(options)],
      });
    }
  },
});

const tocOptions = { includeLevel: [1, 2, 3] };
markdownIt.use(latex);
markdownIt.use(anchor, {
  permalink: anchor.permalink.headerLink(),
});

markdownIt.use(toc, tocOptions);
markdownIt.use(emoji);
markdownIt.use(sub);
markdownIt.use(sup);
markdownIt.use(mark);
markdownIt.use(footnote);
markdownIt.use(deflist);

// Custom renderer for blockquote
markdownIt.renderer.rules.blockquote_open = () => {
  return '<div class="custom-blockquote" style="border-left: 3px solid #ccc; padding-left: 10px; font-style: italic;">';
};

markdownIt.renderer.rules.blockquote_close = () => {
  return "</div>";
};

const defaultRender = markdownIt.renderer.rules.link_open ||
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

export function convertMdToHtml(md: string, codeTheme: string = "ayu-dark"): string {
  currentTheme = codeTheme;
  return markdownIt.render(md);
}

export function convertLabToHtml(course: Course, lab: Lab) {
  lab.summary = markdownIt.render(lab.summary);
  const url = lab.route.replace(`/lab/${course.courseId}`, course.courseUrl);
  lab.los?.forEach((step) => {
    if (course.courseUrl) {
      step.contentMd = filter(step.contentMd, url);
    }
    step.contentHtml = markdownIt.render(step.contentMd);
    step.parentLo = lab;
    step.type = "step";
  });
}

export function convertNoteToHtml(course: Course, note: Note, refreshOnly: boolean = false) {
  note.summary = convertMdToHtml(note.summary);
  const url = note.route.replace(`/note/${course.courseId}`, course.courseUrl);
  if (!refreshOnly) {
    note.contentMd = filter(note.contentMd, url);
  }
  note.contentHtml = convertMdToHtml(note.contentMd);
}


export function convertLoToHtml(course: Course, lo: Lo) {
  if (lo.type === "lab") {
    convertLabToHtml(course, lo as Lab);
  }else if (lo.type == "note") {
    convertNoteToHtml(course, lo as Note);
  } else {
    if (lo.summary) lo.summary = convertMdToHtml(lo.summary);
    let md = lo.contentMd;
    if (md) {
      if (course.courseUrl) {
        const url = lo.route.replace(`/${lo.type}/${course.courseId}`, course.courseUrl);
        md = filter(md, url);
      }
      lo.contentHtml = convertMdToHtml(md);
    }
  }
}

/**
 * Replaces all occurrences of a string pattern
 * @param str - Source string
 * @param find - Pattern to find
 * @param replace - Replacement string
 * @returns Updated string
 */
function replaceAll(str: string, find: string, replace: string) {
  return str.replace(new RegExp(find, "g"), replace);
}

/**
 * Processes markdown content to fix relative URLs
 * Handles images, archives, and internal links
 * @param src - Source markdown content
 * @param url - Base URL for converting relative paths
 * @returns Processed markdown content
 */
export function filter(src: string, url: string): string {
  let filtered = replaceAll(src, "./img\\/", `img/`);
  filtered = replaceAll(filtered, "img\\/", `https://${url}/img/`);
  filtered = replaceAll(filtered, "./archives\\/", `archives/`);
  filtered = replaceAll(filtered, "(?<!/)archives\\/", `https://${url}/archives/`);
  filtered = replaceAll(filtered, "(?<!/)archive\\/(?!refs)", `https://${url}/archive/`);
  filtered = replaceAll(filtered, "\\]\\(\\#", `](https://${url}#/`);
  return filtered;
}
