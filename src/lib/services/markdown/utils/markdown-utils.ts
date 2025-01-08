/* eslint-disable @typescript-eslint/ban-ts-comment */
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
// @ts-ignore
import { addCopyButton } from "shiki-transformer-copy-button";

// optional
const options = {
  // delay time from "copied" state back to normal state
  toggle: 2000
};

let currentTheme = "ayu-dark";

let customHighlighter: any;

export function initHighlighter(codeHighlighter: any) {
  customHighlighter = codeHighlighter;
}

export const markdownIt = new MarkdownIt({
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
        transformers: [addCopyButton(options)]
      });
    }
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

export function convertMdToHtml(md: string, codeTheme: string = "ayu-dark"): string {
  currentTheme = codeTheme;
  return markdownIt.render(md);
}
