
import { assert, assertEquals } from "jsr:@std/assert";
import { exists } from "jsr:@std/fs";
import { relative } from "jsr:@std/path";

export interface FileStructure {
  type: "file" | "directory";
  path: string;
  size?: number;
 children?: FileStructure[];
}
  

  /**
   * Normalizes HTML content for comparison by removing whitespace differences
   */
  export function normalizeHtml(html: string): string {
    return html
      .replace(/>\s+</g, "><")
      .replace(/\s+/g, " ")
      .trim();
  }
  
  /**
   * Compares two HTML files for structural equality
   */
  export async function compareHtmlFiles(actualPath: string, expectedPath: string): Promise<boolean> {
    if (!(await exists(actualPath)) || !(await exists(expectedPath))) {
      return false;
    }
    
    const actualContent = await Deno.readTextFile(actualPath);
    const expectedContent = await Deno.readTextFile(expectedPath);
    
    return normalizeHtml(actualContent) === normalizeHtml(expectedContent);
  } 
  

  export async function compareDirectoryContents(generated: FileStructure, reference: FileStructure): Promise<void> {
    // Compare file contents if it's a file
    console.log("Comparing", reference.path.substring(reference.path.indexOf("reference-html")));
    if (reference.type === "file" && generated.type === "file") {
      const isHtml = reference.path.endsWith(".html");
      if (isHtml) {
        const areEqual = await compareHtmlFiles(generated.path, reference.path);
        assert(areEqual, `HTML content mismatch in file: ${relative(".", generated.path)}`);
      } else {
        const genContent = await Deno.readTextFile(generated.path);
        const refContent = await Deno.readTextFile(reference.path);
        assertEquals(
          genContent.trim(),
          refContent.trim(),
          `File content mismatch in: ${relative(".", generated.path)}`
        );
      }
    }

    // Recursively compare children if it's a directory
    if (reference.type === "directory" && generated.type === "directory" &&
        reference.children && generated.children) {
      // Sort children by path for consistent comparison
      const sortedRefChildren = reference.children.sort((a, b) => 
        relative(".", a.path).localeCompare(relative(".", b.path)));
      const sortedGenChildren = generated.children.sort((a, b) => 
        relative(".", a.path).localeCompare(relative(".", b.path)));

      assertEquals(
        sortedGenChildren.length,
        sortedRefChildren.length,
        `Number of children mismatch in directory: ${relative(".", generated.path)}`
      );

      // Compare each child
      for (let i = 0; i < sortedRefChildren.length; i++) {
        const refChild = sortedRefChildren[i];
        const genChild = sortedGenChildren[i];
        const refName = relative(".", refChild.path).split("/").pop();
        const genName = relative(".", genChild.path).split("/").pop();
        
        assertEquals(
          genName,
          refName,
          `File name mismatch in directory ${relative(".", generated.path)}`
        );

        await compareDirectoryContents(genChild, refChild);
      }
    }
  }
