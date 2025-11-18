/**
 * Markdown processing service with syntax highlighting support.
 * Uses Shiki for code highlighting and supports multiple languages and themes.
 * Handles markdown conversion for labs, notes, and learning objects.
 */

import type { Course, Lab, Note, Lo } from "@tutors/tutors-model-lib";
import { convertMdToHtml, initHighlighter, filter } from "@tutors/tutors-model-lib";

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
import { courseProtocol, rune } from "$lib/runes.svelte";

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
        step.contentMd = filter(step.contentMd, url, courseProtocol.value);
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
      note.contentMd = filter(note.contentMd, url, courseProtocol.value);
    }
    note.contentHtml = convertMdToHtml(note.contentMd, currentCodeTheme.value);
  }
};
