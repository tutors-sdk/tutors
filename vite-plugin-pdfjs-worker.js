import { createFilter } from '@rollup/pluginutils';
import { readFileSync } from 'fs';
import { extname } from 'path';

export default function pdfjsWorkerLoader() {
  const filter = createFilter(['**/*.worker.min.mjs'], ['node_modules/**']);
  
  return {
    name: 'pdfjs-worker-loader',
    load(id) {
      if (!filter(id)) return null;
      
      const code = readFileSync(id, 'utf-8');
      const wrappedCode = `
        const blob = new Blob([${JSON.stringify(code)}], { type: 'application/javascript' });
        export default URL.createObjectURL(blob);
      `;
      
      return {
        code: wrappedCode,
        map: null,
      };
    },
    resolveId(importee, importer) {
      if (importee.endsWith('.worker.min.mjs')) {
        return importee;
      }
      return null;
    }
  };
}
