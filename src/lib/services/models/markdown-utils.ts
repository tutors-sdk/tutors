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

import { createHighlighterCoreSync } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";

import js from "shiki/langs/javascript.mjs";
import ts from "shiki/langs/typescript.mjs";
import css from "shiki/langs/css.mjs";
import html from "shiki/langs/html.mjs";
import json from "shiki/langs/json.mjs";
import yaml from "shiki/langs/yaml.mjs";
import markdown from "shiki/langs/markdown.mjs";
import bash from "shiki/langs/bash.mjs";
import python from "shiki/langs/python.mjs";
import sql from "shiki/langs/sql.mjs";
import typescript from "shiki/langs/typescript.mjs";
import java from "shiki/langs/java.mjs";
import kotlin from "shiki/langs/kotlin.mjs";
import csharp from "shiki/langs/csharp.mjs";
import c from "shiki/langs/c.mjs";
import cpp from "shiki/langs/cpp.mjs";
import go from "shiki/langs/go.mjs";
import rust from "shiki/langs/rust.mjs";
import php from "shiki/langs/php.mjs";
import ruby from "shiki/langs/ruby.mjs";
import swift from "shiki/langs/swift.mjs";
import dockerfile from "shiki/langs/dockerfile.mjs";

import monokai from "shiki/themes/monokai.mjs";
import solarizedDark from "shiki/themes/solarized-dark.mjs";
import solarizedLight from "shiki/themes/solarized-light.mjs";
import nightOwl from "shiki/themes/night-owl.mjs";
import githubDark from "shiki/themes/github-dark.mjs";
import dracula from "shiki/themes/dracula.mjs";
import snazziLight from "shiki/themes/snazzy-light.mjs";
import githubLightHighContrast from "shiki/themes/github-light-high-contrast.mjs";
const languages = [
  js,
  ts,
  css,
  html,
  json,
  yaml,
  markdown,
  bash,
  python,
  sql,
  typescript,
  java,
  kotlin,
  csharp,
  c,
  cpp,
  go,
  rust,
  php,
  ruby,
  swift,
  dockerfile,
  html
];

export const codeThemes = [
  monokai,
  solarizedLight,
  githubDark,
  githubLightHighContrast,
  nightOwl,
  dracula,
  solarizedDark,
  snazziLight
];

const shiki = createHighlighterCoreSync({
  themes: codeThemes,
  langs: languages,
  engine: createJavaScriptRegexEngine()
});

let currentTheme = "monokai";

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
      return shiki?.codeToHtml(str, { lang, theme: currentTheme });
    } catch (e) {
      return shiki?.codeToHtml(str, { lang: "", theme: currentTheme });
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

export function convertMdToHtml(md: string, codeTheme: string): string {
  currentTheme = codeTheme;
  return markdownIt.render(md);
}
