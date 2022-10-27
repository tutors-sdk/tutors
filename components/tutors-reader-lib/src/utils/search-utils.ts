import type { Lo } from "../types/lo-types";
import { removeLeadingHashes } from "./lo-utils";

const maxNumberHits = 100;
const fenceTick = "```";
const fenceTilde = "~~~";

type ContentType = {
  content: string;
  style: string; //fenced, unfenced
  language: string;
  fence: string; //  ``` or ~~~
};

export type ResultType = {
  fenced: boolean;
  language: string;
  contentMd: string;
  lab: Lo;
  html: string;
  title: string;
  link: string;
};
/**
 * Searches an array of nested Lo arrays for presence of searchTerm.
 * On 31.10.19 resolved the issue whereby only first instance of a searchTerm on any
 * web page returned. Now all instances of the search term identified.
 *
 * Fenced code: the following approach used to determing if content resides with a fence pair.
 * An array of the indices of the first character of each fence is created. Opening fence
 * indices are even. Fencing may comprise tildes or ticks. A fence pair must comprise either tildes
 * or ticks. Mixing types in the fence pair is assumed not to be present. A page may contain either
 * tilde or tick fence pairs or both.
 *
 * Language: The fenced language is determined by checking for its presence at the end of
 * the opening fence pair.
 *
 * @param los The nested arrays of Lo objects.
 * @param searchTerm The term whose presence is searched for.
 * @return string array of search term hits truncated to maxNumberHits length.
 */
export function searchHits(los: Lo[], searchTerm: string): ResultType[] {
  const flatLos = flattenNestedLosArrays(los);
  //let result : string[] = [];
  const results: ResultType[] = [];
  flatLos.forEach((obj) => {
    const text = obj.lab.contentMd;
    const contents: ContentType[] = arrayLinesSearchTermHits(text, searchTerm);
    for (const content of contents) {
      const result = {
        fenced: content.style !== "unfenced",
        language: content.language,
        contentMd: content.content,
        lab: obj.lab,
        title: `${obj.lab.parentLo.title}/${removeLeadingHashes(obj.lab.title)}`,
        link: obj.lab?.route,
        html: "",
      };
      result.link = result.link.substring(1);
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      result.link = "#/" + result.link;
      results.push(result);
    }
  });
  return results.slice(0, maxNumberHits);
}
/**
 * Returns an array of substrings of content comprising lines on which searchTerm located.
 *
 * Example:  content  = 'syeasy and hard synchronized syncsy';
 * searchTerm = 'sy';
 * arStrings: ["syeasy", "syeasy and", "ard synchr", "zed syncsy", "syncsy"]
 *
 * @param content The string within which one or more searchTerm substrings exist.
 * @param searchTerm The substring, at lease one instance of which exists.
 * @return string array of lines of content containing search term.
 */
function arrayLinesSearchTermHits(content: string, searchTerm: string): ContentType[] {
  const arStrings: ContentType[] = [];
  const arIndx = indicesOf(content, searchTerm); // indices of searchTerm occurences
  for (let i = 0; i < arIndx.length; i += 1) {
    const str = currentline(searchTerm, arIndx[i], content);
    const style = isFenced(content, arIndx[i]);
    let language = "";
    if (style === "fenced") {
      language = getLanguage(content, arIndx[i]);
    }
    const fence = getFenceType(content, arIndx[i]);
    arStrings.push({ content: str, style, fence, language });
  }
  return arStrings;
}

/**
 * Extracts from the web page the language for the current fenced item.
 * Language types may vary with a page.
 * @param content The webpage text
 * @param indexSearchTerm the index of the first character of the search term.
 * @returns the language for the current fenced section.
 */
function getLanguage(content: string, indexSearchTerm: number): string {
  const ar = arStartFenceIndices(content);
  const indexFence = findNearestPreviousIndex(ar, indexSearchTerm);
  let language = "";
  let index = indexFence[1] + 3; // fence comprises 3 tickks or tildes.
  while (content.charAt(index) !== "\n") {
    language += content.charAt(index);
    index += 1;
  }
  return language;
}

/**
 *
 * @param content the fence type may comprise tildes or ticks.
 * @param indexSearchTerm
 * @returns fence type: string comprising 3 tildes or 3 ticks.
 */
function getFenceType(content: string, indexSearchTerm: number): string {
  const ar = arStartFenceIndices(content);
  const indexFence = findNearestPreviousIndex(ar, indexSearchTerm);
  if (content.charAt(indexFence[1]) === "~") {
    return "~~~";
  }
  return "```";
}

/*
 * Extract and return the path from parameter 'astring'.
 * astring format: -<a href = #path"> Simple </a>
 *                  <a href="${obj.lab.route}"> ...
 *
 * Modify 'astring' by inserting / following #.
 * For example, replace this: "#lab/... with: "#/lab..."
 *
 * @param astring String to parse for path (route).
 * @return The path
 */
export function extractPath(astring: string) {
  const regex = /#/;
  astring = astring.replace(regex, "#/");
  const start = astring.indexOf("#");
  const end = astring.indexOf(">") - 1; // exclude preceeding double quote.
  return astring.substring(start, end);
}
/**
 * Given the route, discover and return a reference to the parent Lo object.
 * @param route
 */
export function findLo(route: string, los: Lo[]): Lo {
  const flatLos = flattenNestedLosArrays(los);
  let lo: Lo;
  flatLos.forEach((obj) => {
    if (obj.lab.route === route) {
      lo = obj.lab;
    }
  });
  return lo;
}
/**
 * Convert the tree of los into an array.
 * @param los
 * @returns
 */
function flattenNestedLosArrays(los: Lo[]) {
  return flatten(los, "");
}
function flatten(arr: Lo[], topicTitle: string, result = []) {
  for (let i = 0, length = arr.length; i < length; i++) {
    const value = arr[i];
    if (Array.isArray(value.los)) {
      flatten(value.los, arr[i].parent.lo.title, result);
    } else {
      result.push({ lab: value, topicTitle: topicTitle });
    }
  }
  return result;
}

/**
 * Validate a string: is valid if it is not undefined and
 * does not comprise only whitespace else it is invalid.
 * @param str A string being validated.
 * @returns true if valid else false.
 */

function onlySpaces(str: string) {
  return str.trim().length === 0;
}
export function isValid(str: string) {
  // return str != undefined && /\S/.test(str) == true;
  return !onlySpaces(str);
}

/**
 * indicesOf: This method uses the Javascript indexOf method.
 * indexOf is invoked recursively to locate the start indices of an optionally recurring substring within a string.
 * The method is valid even if the specified substring is empty.
 * Since indexOf is case sensitive then it follows that indicesOf is case sensitive.
 *  Example: str = syeasy and hard synchronized syncsy'
 *  Substring: 'sy'
 *  Output: [0, 4, 16, 29, 33]
 * @author: jfitzgerald
 * @param str The target or specified string within which the first index of each substring is sought.
 * @param substr The substring(s) whose indices are being determined.
 * @return An array of the indices of positions of first character of each substring. If no mon-empty substring is
 *         present then empty array returned.
 */
function indicesOf(str: string, substr: string): number[] {
  const arIndx: number[] = [];
  function indicesOf(str: string, substr: string, arIndx: number[]): number[] {
    let n = str.indexOf(substr);
    if (n != -1) {
      const prev_n = n;
      if (arIndx.length) {
        n += arIndx[arIndx.length - 1] + substr.length;
      }
      arIndx.push(n);
      indicesOf(str.slice(prev_n + substr.length), substr, arIndx);
    } else {
      return;
    }
  }
  indicesOf(str, substr, arIndx);
  return arIndx;
}

/**
 * Generate an array of indices of first character in each opening fence.
 * @param content
 * @returns array of indices
 */
function arStartFenceIndices(content: string): number[] {
  const ar = arrayStartFenceIndices(content, fenceTick).concat(arrayStartFenceIndices(content, fenceTilde));
  return numericSort(ar);
}

/**
 * Utility function to sort an array of integers in ascending order.
 * @param ar
 * @returns
 */
function numericSort(ar: number[]) {
  return ar.sort((n1, n2) => n1 - n2);
}

/**
 *
 * Determines if a searchTerm resides within fenced section of page.
 * The fence may be defined as ticks or tildes.
 * @param content The string containing the searchTerm.
 * @param searchTermIndex The index of the searchTerm.
 * @returns A string: fenced or unfenced.
 */
function isFenced(content: string, searchTermIndex: number): string {
  //let ar : number[] = arrayStartFenceIndices(content, fenceTick).concat(arrayStartFenceIndices(content, fenceTilde));
  const ar = arStartFenceIndices(content);
  // If length array of start fence indices is zero this means searchTerm is in html range.
  // That is, no fenced content.
  if (ar.length == 0) {
    return "unfenced";
  }
  const prevSmaller = findNearestPreviousIndex(ar, searchTermIndex);
  if (isEven(prevSmaller[0])) {
    return "fenced";
  } else {
    return "unfenced";
  }
}

/**
 * Generates an array of indices of the first character of opening fence.
 * @param content
 * @param fenceType ticks or tildes
 * @returns array of indices
 */
function arrayStartFenceIndices(content: string, fenceType: string): number[] {
  const ar = indicesOf(content, fenceType);
  return ar;
}

/**
 * Utility function: determines of integer is even.
 * @param aninteger
 * @returns true if aninteger even else false.
 */
function isEven(aninteger: number): boolean {
  return aninteger % 2 == 0;
}

/**
 * The current line is bounded by \n characters, excepting conditions which are allowd for.
 * @param searchTerm
 * @param indexSearchTerm
 * @param content The current page.
 * @returns A string representing the line in which the searchTerm is located.
 */
function currentline(searchTerm: string, indexSearchTerm: number, content: string): string {
  const arrayIndicesSeparators = indicesOf(content, separator());
  const indexStartLine = findNearestPreviousIndex(arrayIndicesSeparators, indexSearchTerm);
  const indexEndLine = findNearestNextIndex(arrayIndicesSeparators, indexSearchTerm, content.length);
  const currentLine = content.substring(indexStartLine[1], indexEndLine[1]);
  return currentLine;
}
/**
 * Given an array of indices and a current index obtain the nearest smaller index to the current index.
 * @param indices An array of indices
 * @param currIndex The index of the searchTerm
 * @returns An array of tuples, each tuple containing the array index and the index immediately previous to current index.
 */
function findNearestPreviousIndex(indices: number[], currIndex: number): [number, number] {
  for (let i = indices.length - 1; i >= 0; i--) {
    if (indices[i] < currIndex) {
      return [i, indices[i]];
    }
  }
  return [-1, -1];
}
/**
 *
 * @param indices An array of indices of separators (such as \n).
 * @param currIndex The index of the searchTerm.
 * @param contentLen The index of the last character of the current page.
 * @returns An array of tuples, each tuple containing the array index and the index immediately following the current index.
 *
 */
function findNearestNextIndex(indices: number[], currIndex: number, contentLen: number): [number, number] {
  for (let i = 0; i < indices.length; i += 1) {
    if (currIndex > indices[indices.length - 1]) {
      return [i, contentLen]; // Edge condition where no eof character exists.
    } else if (indices[i] > currIndex) {
      return [i, indices[i]];
    }
  }
  return [-1, -1]; //Something's up doc and it isn't good.
}

/**
 *
 * @returns new line character as string.
 */
function separator(): string {
  return "\n";
}
