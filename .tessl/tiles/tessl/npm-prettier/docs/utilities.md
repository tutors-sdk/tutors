# Utility Functions

Prettier provides extensive utility functions for text processing, AST navigation, position tracking, and comment manipulation. These utilities are essential for plugin development and advanced formatting scenarios.

## Importing Utilities

```javascript { .api }
import { util } from 'prettier';

// Access all utilities
const { getStringWidth, skipWhitespace, addLeadingComment } = util;
```

## String and Text Processing

### getStringWidth
```javascript { .api }
function getStringWidth(text: string): number
```

Get the display width of a string, accounting for Unicode characters, emoji, and ANSI escape codes.

**Example:**
```javascript { .api }
const width1 = util.getStringWidth('hello'); // 5
const width2 = util.getStringWidth('你好');   // 4 (CJK characters are width 2)
const width3 = util.getStringWidth('🎉');    // 2 (emoji width)
```

### getMaxContinuousCount
```javascript { .api }
function getMaxContinuousCount(text: string, searchString: string): number
```

Count the maximum continuous occurrences of a substring in text.

**Example:**
```javascript { .api }
const maxQuotes = util.getMaxContinuousCount('"""hello"""', '"'); // 3
const maxSpaces = util.getMaxContinuousCount('a    b  c', ' ');    // 4
```

### getAlignmentSize
```javascript { .api }
function getAlignmentSize(text: string, tabWidth: number, startIndex?: number): number
```

Calculate the alignment size for a text string, considering tabs and spaces.

**Parameters:**
- `text` (string): Text to measure
- `tabWidth` (number): Width of tab characters
- `startIndex` (number, optional): Starting position (default: 0)

**Example:**
```javascript { .api }
const size1 = util.getAlignmentSize('  text', 2);     // 2
const size2 = util.getAlignmentSize('\ttext', 4);     // 4
const size3 = util.getAlignmentSize(' \t text', 4);   // 5 (1 space + 4 tab - 1 for alignment)
```

### getIndentSize
```javascript { .api }
function getIndentSize(value: string, tabWidth: number): number
```

Calculate the indentation size of a string.

**Example:**
```javascript { .api }
const indent1 = util.getIndentSize('    code', 2);  // 4
const indent2 = util.getIndentSize('\t\tcode', 4);  // 8
const indent3 = util.getIndentSize(' \t code', 4);  // 5
```

## Quote Handling

### makeString
```javascript { .api }
function makeString(
  rawText: string, 
  enclosingQuote: "'" | '"', 
  unescapeUnnecessaryEscapes?: boolean
): string
```

Create a properly quoted and escaped string literal.

**Parameters:**
- `rawText` (string): Raw text content
- `enclosingQuote` (Quote): Quote character to use
- `unescapeUnnecessaryEscapes` (boolean, optional): Remove unnecessary escapes

**Example:**
```javascript { .api }
const quoted1 = util.makeString('hello "world"', "'"); // "'hello \"world\"'"
const quoted2 = util.makeString("it's nice", '"');     // '"it\'s nice"'
const quoted3 = util.makeString('simple', '"');        // '"simple"'
```

### getPreferredQuote
```javascript { .api }
function getPreferredQuote(
  text: string, 
  preferredQuoteOrPreferSingleQuote: "'" | '"' | boolean
): "'" | '"'
```

Determine the preferred quote character for a string to minimize escaping.

**Parameters:**
- `text` (string): Text content to quote
- `preferredQuoteOrPreferSingleQuote` (Quote | boolean): Preference setting

**Example:**
```javascript { .api }
const quote1 = util.getPreferredQuote('hello "world"', "'"); // "'" (no escaping needed)
const quote2 = util.getPreferredQuote("it's nice", '"');     // '"' (no escaping needed)
const quote3 = util.getPreferredQuote('simple', true);       // "'" (prefer single)
```

## Position and Navigation

### Skip Functions

All skip functions follow this pattern:
- Take `text` and `startIndex` parameters
- Return new index position or `false` if pattern not found
- Support optional `backwards` direction

```javascript { .api }
interface SkipOptions {
  backwards?: boolean; // Skip in reverse direction
}
```

### skipWhitespace
```javascript { .api }
const skipWhitespace: (
  text: string, 
  startIndex: number | false, 
  options?: SkipOptions
) => number | false
```

Skip whitespace characters (spaces, tabs, newlines).

**Example:**
```javascript { .api }
const text = 'code   \n  more';
const nextPos = util.skipWhitespace(text, 4); // 10 (after whitespace)
const prevPos = util.skipWhitespace(text, 10, { backwards: true }); // 4
```

### skipSpaces
```javascript { .api }
const skipSpaces: (
  text: string, 
  startIndex: number | false, 
  options?: SkipOptions
) => number | false
```

Skip space characters only (not tabs or newlines).

**Example:**
```javascript { .api }
const text = 'code   \tmore';
const nextPos = util.skipSpaces(text, 4); // 7 (stops at tab)
```

### skipNewline
```javascript { .api }
function skipNewline(
  text: string, 
  startIndex: number | false, 
  options?: SkipOptions
): number | false
```

Skip a single newline character (LF, CRLF, or CR).

**Example:**
```javascript { .api }
const text = 'line1\nline2';
const nextPos = util.skipNewline(text, 5); // 6 (after newline)
```

### skipToLineEnd
```javascript { .api }
const skipToLineEnd: (
  text: string, 
  startIndex: number | false, 
  options?: SkipOptions
) => number | false
```

Skip to the end of the current line.

### skipEverythingButNewLine
```javascript { .api }
const skipEverythingButNewLine: (
  text: string, 
  startIndex: number | false, 
  options?: SkipOptions
) => number | false
```

Skip all characters except newlines.

### Generic skip Function
```javascript { .api }
function skip(characters: string | RegExp): (
  text: string, 
  startIndex: number | false, 
  options?: SkipOptions
) => number | false
```

Create a custom skip function for specific characters or patterns.

**Example:**
```javascript { .api }
const skipDigits = util.skip(/\d/);
const skipPunctuation = util.skip('.,;:!?');

const text = '123abc';
const afterDigits = skipDigits(text, 0); // 3

const text2 = '...text';
const afterPuncts = skipPunctuation(text2, 0); // 3
```

## Comment Processing

### skipInlineComment
```javascript { .api }
function skipInlineComment(text: string, startIndex: number | false): number | false
```

Skip JavaScript-style inline comments (`// comment`).

**Example:**
```javascript { .api }
const text = 'code // comment\nmore';
const afterComment = util.skipInlineComment(text, 5); // 15 (after comment)
```

### skipTrailingComment
```javascript { .api }
function skipTrailingComment(text: string, startIndex: number | false): number | false
```

Skip JavaScript-style block comments (`/* comment */`).

**Example:**
```javascript { .api }
const text = 'code /* comment */ more';
const afterComment = util.skipTrailingComment(text, 5); // 18 (after comment)
```

## Character and Position Testing

### hasNewline
```javascript { .api }
function hasNewline(text: string, startIndex: number, options?: SkipOptions): boolean
```

Check if there's a newline at the specified position.

**Example:**
```javascript { .api }
const text = 'line1\nline2';
const hasNL = util.hasNewline(text, 5); // true
```

### hasNewlineInRange
```javascript { .api }
function hasNewlineInRange(text: string, startIndex: number, endIndex: number): boolean
```

Check if there's a newline within a character range.

**Example:**
```javascript { .api }
const text = 'no newline here';
const hasNL = util.hasNewlineInRange(text, 0, 10); // false
```

### hasSpaces
```javascript { .api }
function hasSpaces(text: string, startIndex: number, options?: SkipOptions): boolean
```

Check if there are spaces at the specified position.

### getNextNonSpaceNonCommentCharacterIndex
```javascript { .api }
function getNextNonSpaceNonCommentCharacterIndex(text: string, startIndex: number): number | false
```

Find the index of the next significant character, skipping whitespace and comments.

**Example:**
```javascript { .api }
const text = 'code  /* comment */  more';
const nextChar = util.getNextNonSpaceNonCommentCharacterIndex(text, 4); // 20 ('m' in 'more')
```

### getNextNonSpaceNonCommentCharacter
```javascript { .api }
function getNextNonSpaceNonCommentCharacter(text: string, startIndex: number): string
```

Get the next significant character, skipping whitespace and comments.

**Example:**
```javascript { .api }
const text = 'code  /* comment */  more';
const nextChar = util.getNextNonSpaceNonCommentCharacter(text, 4); // 'm'
```

### isNextLineEmpty
```javascript { .api }
function isNextLineEmpty(text: string, startIndex: number): boolean
```

Check if the next line after the given position is empty.

**Example:**
```javascript { .api }
const text = 'line1\n\nline3';
const isEmpty = util.isNextLineEmpty(text, 5); // true (line after line1 is empty)
```

### isPreviousLineEmpty
```javascript { .api }
function isPreviousLineEmpty(text: string, startIndex: number): boolean
```

Check if the previous line before the given position is empty.

**Example:**
```javascript { .api }
const text = 'line1\n\nline3';
const isEmpty = util.isPreviousLineEmpty(text, 8); // true (line before line3 is empty)
```

## Comment Manipulation

### addLeadingComment
```javascript { .api }
function addLeadingComment(node: any, comment: any): void
```

Add a comment before an AST node.

**Example:**
```javascript { .api }
const node = { type: 'Identifier', name: 'x' };
const comment = { type: 'Line', value: ' This is x' };
util.addLeadingComment(node, comment);
// node.leadingComments = [comment]
```

### addTrailingComment
```javascript { .api }
function addTrailingComment(node: any, comment: any): void
```

Add a comment after an AST node.

**Example:**
```javascript { .api }
const node = { type: 'Identifier', name: 'x' };
const comment = { type: 'Line', value: ' End of x' };
util.addTrailingComment(node, comment);
// node.trailingComments = [comment]
```

### addDanglingComment
```javascript { .api }
function addDanglingComment(node: any, comment: any, marker: any): void
```

Add a comment inside an AST node (not leading or trailing).

**Parameters:**
- `node` (any): AST node to add comment to
- `comment` (any): Comment object to add
- `marker` (any): Marker for comment placement

**Example:**
```javascript { .api }
const node = { type: 'ObjectExpression', properties: [] };
const comment = { type: 'Block', value: ' empty object ' };
util.addDanglingComment(node, comment, 'inside');
// node.comments = [comment]
```

## Usage Patterns

### Text Processing Pipeline
```javascript { .api }
function processText(text, startIndex) {
  // Skip initial whitespace
  let pos = util.skipWhitespace(text, startIndex);
  if (pos === false) return null;
  
  // Skip comments
  pos = util.skipInlineComment(text, pos) || pos;
  pos = util.skipTrailingComment(text, pos) || pos;
  
  // Get next significant character
  const nextChar = util.getNextNonSpaceNonCommentCharacter(text, pos);
  
  return {
    position: pos,
    character: nextChar,
    width: util.getStringWidth(text.slice(startIndex, pos))
  };
}
```

### String Quoting Logic
```javascript { .api }
function smartQuote(text, preferSingle = false) {
  const preferred = preferSingle ? "'" : '"';
  const optimal = util.getPreferredQuote(text, preferred);
  return util.makeString(text, optimal, true);
}
```

### Position Navigation
```javascript { .api }
function findStatementEnd(text, startIndex) {
  let pos = startIndex;
  
  while (pos < text.length) {
    // Skip whitespace and comments
    pos = util.skipWhitespace(text, pos) || pos;
    pos = util.skipInlineComment(text, pos) || pos;
    pos = util.skipTrailingComment(text, pos) || pos;
    
    // Check for statement terminator
    if (text[pos] === ';' || util.hasNewline(text, pos)) {
      return pos;
    }
    
    pos++;
  }
  
  return pos;
}
```

### Comment Processing
```javascript { .api }
function attachComments(ast, comments) {
  for (const comment of comments) {
    const beforeNode = findNodeBefore(ast, comment.start);
    const afterNode = findNodeAfter(ast, comment.end);
    
    if (beforeNode && isOnSameLine(beforeNode.end, comment.start)) {
      util.addTrailingComment(beforeNode, comment);
    } else if (afterNode && isOnSameLine(comment.end, afterNode.start)) {
      util.addLeadingComment(afterNode, comment);
    } else {
      // Dangling comment
      const parentNode = findParentNode(ast, comment);
      if (parentNode) {
        util.addDanglingComment(parentNode, comment, 'inside');
      }
    }
  }
}
```

### Indentation Calculation
```javascript { .api }
function calculateIndentation(line, tabWidth) {
  const trimmed = line.trimStart();
  const indentText = line.slice(0, line.length - trimmed.length);
  
  return {
    size: util.getIndentSize(indentText, tabWidth),
    alignment: util.getAlignmentSize(indentText, tabWidth),
    text: indentText,
    content: trimmed
  };
}
```

## Deprecated Functions

### isNextLineEmptyAfterIndex (Deprecated)
```javascript { .api }
function isNextLineEmptyAfterIndex(text: string, startIndex: number): boolean
```

**⚠️ Deprecated**: This function will be removed in v4. Use `isNextLineEmpty` instead.

Legacy function that checks if the next line after the given index is empty.

**Example:**
```javascript { .api }
// Deprecated usage
const isEmpty = util.isNextLineEmptyAfterIndex(text, 5);

// Modern equivalent
const isEmpty = util.isNextLineEmpty(text, 5);
```

## Performance Notes

- Skip functions return early with `false` if `startIndex` is `false`
- String width calculation caches results for repeated calls
- Comment utilities modify AST nodes in place
- Position functions work with zero-based indices
- All functions handle edge cases (empty strings, invalid positions)