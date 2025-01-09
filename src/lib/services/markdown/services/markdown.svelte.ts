/**
 * Markdown processing service with syntax highlighting support.
 * Uses Shiki for code highlighting and supports multiple languages and themes.
 * Handles markdown conversion for labs, notes, and learning objects.
 */

import type { Course, Lab, Note, Lo } from "$lib/services/base";
import { convertMdToHtml, initHighlighter } from "../utils/markdown-utils";

// Import Shiki themes
import ayuDark from "shiki/themes/ayu-dark.mjs";
import catppuccin from "shiki/themes/catppuccin-latte.mjs";
import monokai from "shiki/themes/monokai.mjs";
import solarizedLight from "shiki/themes/solarized-light.mjs";
import nightOwl from "shiki/themes/night-owl.mjs";
import githubDark from "shiki/themes/github-dark.mjs";
import githubLight from "shiki/themes/github-light.mjs";
import { createHighlighterCoreSync } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";

// Import language definitions
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
import { browser } from "$app/environment";
import type { MarkdownService } from "../types";
import { rune } from "$lib/runes.svelte";

/** Supported programming languages for syntax highlighting */
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

/** Available syntax highlighting themes */
const codeThemes = [ayuDark, monokai, githubDark, nightOwl, solarizedLight, githubLight, catppuccin];

/** Currently selected code theme */
export const currentCodeTheme = rune("ayu-dark");

/** Initialize Shiki highlighter with supported languages and themes */
const shiki = createHighlighterCoreSync({
  themes: codeThemes,
  langs: languages,
  engine: createJavaScriptRegexEngine()
});

// Restore user's preferred code theme
if (browser && localStorage.codeTheme) {
  currentCodeTheme.value = localStorage.codeTheme;
}
initHighlighter(shiki);

export const markdownService: MarkdownService = {
  /** Available syntax highlighting themes */
  codeThemes: codeThemes,

  /**
   * Sets and persists the syntax highlighting theme
   * @param theme - Theme name to set
   */
  setCodeTheme(theme: string): void {
    if (codeThemes.find((t) => t.name === theme)) {
      currentCodeTheme.value = theme;
    } else {
      currentCodeTheme.value = "ayu-dark";
    }
    localStorage.codeTheme = currentCodeTheme.value;
  },

  /**
   * Converts lab markdown content to HTML
   * Processes both lab summary and individual steps
   * @param course - Course containing the lab
   * @param lab - Lab to convert
   * @param refreshOnly - If true, skips URL processing
   */
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

  /**
   * Converts note markdown content to HTML
   * @param course - Course containing the note
   * @param note - Note to convert
   * @param refreshOnly - If true, skips URL processing
   */
  convertNoteToHtml(course: Course, note: Note, refreshOnly: boolean = false) {
    note.summary = convertMdToHtml(note.summary, currentCodeTheme.value);
    const url = note.route.replace(`/note/${course.courseId}`, course.courseUrl);
    if (!refreshOnly) {
      note.contentMd = this.filter(note.contentMd, url);
    }
    note.contentHtml = convertMdToHtml(note.contentMd, currentCodeTheme.value);
  },

  /**
   * Converts learning object markdown content to HTML
   * Handles different learning object types appropriately
   * @param course - Course containing the learning object
   * @param lo - Learning object to convert
   */
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

  /**
   * Replaces all occurrences of a string pattern
   * @param str - Source string
   * @param find - Pattern to find
   * @param replace - Replacement string
   * @returns Updated string
   */
  replaceAll(str: string, find: string, replace: string) {
    return str.replace(new RegExp(find, "g"), replace);
  },

  /**
   * Processes markdown content to fix relative URLs
   * Handles images, archives, and internal links
   * @param src - Source markdown content
   * @param url - Base URL for converting relative paths
   * @returns Processed markdown content
   */
  filter(src: string, url: string): string {
    let filtered = this.replaceAll(src, "./img\\/", `img/`);
    filtered = this.replaceAll(filtered, "img\\/", `https://${url}/img/`);
    filtered = this.replaceAll(filtered, "./archives\\/", `archives/`);
    filtered = this.replaceAll(filtered, "(?<!/)archives\\/", `https://${url}/archives/`);
    filtered = this.replaceAll(filtered, "(?<!/)archive\\/(?!refs)", `https://${url}/archive/`);
    filtered = this.replaceAll(filtered, "\\]\\(\\#", `](https://${url}#/`);
    return filtered;
  }
};
