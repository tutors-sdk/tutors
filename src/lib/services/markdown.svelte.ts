import type { Course, Lab, Note, Lo } from "./models/lo-types";
import { convertMdToHtml, initHighlighter } from "./models/markdown-utils";

import ayuDark from "shiki/themes/ayu-dark.mjs";
import catppuccin from "shiki/themes/catppuccin-latte.mjs";
import monokai from "shiki/themes/monokai.mjs";
import solarizedLight from "shiki/themes/solarized-light.mjs";
import nightOwl from "shiki/themes/night-owl.mjs";
import githubDark from "shiki/themes/github-dark.mjs";
import githubLight from "shiki/themes/github-light.mjs";
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
import jsx from "shiki/langs/jsx.mjs";
import svelte from "shiki/langs/svelte.mjs";
import haskell from "shiki/langs/haskell.mjs";
import scala from "shiki/langs/scala.mjs";
import powershell from "shiki/langs/powershell.mjs";
import r from "shiki/langs/r.mjs";
import shell from "shiki/langs/shell.mjs";
import xml from "shiki/langs/xml.mjs";
import vue from "shiki/langs/vue.mjs";
import { currentCodeTheme } from "$lib/runes";
import { browser } from "$app/environment";
import type { MarkdownService } from "./types.svelte";
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
  html,
  jsx,
  svelte,
  haskell,
  scala,
  powershell,
  r,
  shell,
  vue,
  xml
];

const codeThemes = [ayuDark, monokai, githubDark, nightOwl, solarizedLight, githubLight, catppuccin];

const shiki = createHighlighterCoreSync({
  themes: codeThemes,
  langs: languages,
  engine: createJavaScriptRegexEngine()
});
if (browser && localStorage.codeTheme) {
  currentCodeTheme.value = localStorage.codeTheme;
}
initHighlighter(shiki);

export const markdownService: MarkdownService = {
  codeThemes: codeThemes,

  setCodeTheme(theme: string): void {
    if (codeThemes.find((t) => t.name === theme)) {
      currentCodeTheme.value = theme;
    } else {
      currentCodeTheme.value = "ayu-dark";
    }
    localStorage.codeTheme = currentCodeTheme.value;
  },

  convertLabToHtml(course: Course, lab: Lab, refreshOnly: boolean = false) {
    lab.summary = convertMdToHtml(lab.summary, currentCodeTheme.value);
    const url = lab.route.replace(`/lab/${course.courseId}`, course.courseUrl);
    lab?.los?.forEach((step) => {
      if (course.courseUrl && !refreshOnly) {
        step.contentMd = this.filter(step.contentMd, url);
      }
      step.contentHtml = convertMdToHtml(step.contentMd, currentCodeTheme.value);
      step.parentLo = lab;
      step.type = "step";
    });
  },

  convertNoteToHtml(course: Course, note: Note, refreshOnly: boolean = false) {
    note.summary = convertMdToHtml(note.summary, currentCodeTheme.value);
    const url = note.route.replace(`/note/${course.courseId}`, course.courseUrl);
    if (!refreshOnly) {
      note.contentMd = this.filter(note.contentMd, url);
    }
    note.contentHtml = convertMdToHtml(note.contentMd, currentCodeTheme.value);
  },

  convertLoToHtml(course: Course, lo: Lo) {
    if (lo.type === "lab" || lo.type == "note") {
      // convertLabToHtml(course, lo as Lab);
    } else {
      if (lo.summary) lo.summary = convertMdToHtml(lo.summary, currentCodeTheme.value);
      let md = lo.contentMd;
      if (md) {
        if (course.courseUrl) {
          const url = lo.route.replace(`/${lo.type}/${course.courseId}`, course.courseUrl);
          md = this.filter(md, url);
        }
        lo.contentHtml = convertMdToHtml(md, currentCodeTheme.value);
      }
    }
  },

  replaceAll(str: string, find: string, replace: string) {
    return str.replace(new RegExp(find, "g"), replace);
  },

  filter(src: string, url: string): string {
    let filtered = this.replaceAll(src, "./img\\/", `img/`);
    filtered = this.replaceAll(filtered, "img\\/", `https://${url}/img/`);
    filtered = this.replaceAll(filtered, "./archives\\/", `archives/`);

    //filtered = replaceAll(filtered, "archives\\/", `https://${url}/archives/`);
    filtered = this.replaceAll(filtered, "(?<!/)archives\\/", `https://${url}/archives/`);

    // filtered = replaceAll(filtered, "./archive\\/(?!refs)", `archive/`);
    filtered = this.replaceAll(filtered, "(?<!/)archive\\/(?!refs)", `https://${url}/archive/`);
    filtered = this.replaceAll(filtered, "\\]\\(\\#", `](https://${url}#/`);
    return filtered;
  }
};
