type TocItem = {
  anchor: string;
  level: number;
  text: string;
};

type MetaInfo =
  | {
      type: "toc";
    }
  | {
      type: "header";
      anchor: string;
      level: number;
      text: string;
    };

export function generateToc(source: string): string {
  const toc: TocItem[] = [];

  const regex = /(<h([1-6]).*?id="([^"]*?)".*?>(.+?)<\/h[1-6]>)|(<p>\[toc\]<\/p>)/g;

  // find and collect all headers and [toc] node;
  const collection: MetaInfo[] = [];
  source.replace(regex, (wholeMatch, _, level, anchor, text) => {
    if (wholeMatch === "<p>[toc]</p>") {
      collection.push({ type: "toc" });
    } else {
      text = text.replace(/<[^>]+>/g, "");
      const tocItem = {
        anchor,
        level: Number(level),
        text,
      };
      if (toc) {
        toc.push(tocItem);
      }
      collection.push({
        type: "header",
        ...tocItem,
      });
    }
    return "";
  });

  // calculate toc info
  const tocCollection: TocItem[][] = [];
  collection.forEach(({ type }, index) => {
    if (type === "toc") {
      if (collection[index + 1] && collection[index + 1].type === "header") {
        const headers = [];
        const { level: levelToToc } = collection[index + 1] as TocItem;
        for (let i = index + 1; i < collection.length; i++) {
          if (collection[i].type === "toc") break;
          const { level } = collection[i] as TocItem;
          if (level === levelToToc) {
            headers.push(collection[i] as TocItem);
          }
        }
        tocCollection.push(headers);
      } else {
        tocCollection.push([]);
      }
    }
  });

  // replace [toc] node in source
  source = source.replace(/<p>\[toc\]<\/p>[\n]*/g, () => {
    const headers = tocCollection.shift();
    if (headers && headers.length) {
      const str = `<ol>${headers
        .map(
          ({ text, anchor }) =>
            `<li><a style="cursor: pointer;" onClick="document.getElementById('${anchor}').scrollIntoView({ behavior: 'smooth', block: 'center' });">${text}</a></li>`
        )
        .join("")}</ol>\n`;
      return str;
    }
    return "";
  });

  return source;
}
