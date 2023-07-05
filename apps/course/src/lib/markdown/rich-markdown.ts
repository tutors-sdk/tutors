// import showdown from "showdown";
// import showdownHighlight from "showdown-highlight";
// import { showdownCopyCode } from "showdown-copy-code";
// import customClassExt from "showdown-custom-class";
// import { initRichConverter } from "tutors-reader-lib/src/utils/markdown-utils";

// let converter: any;

// function convertMdToHtml(md: string): string {
//     return converter.makeHtml(md);
// }

// export async function initKaytex() {
//     //const kaytex = await import("showdown-katex");
//     let showdownConverter = new showdown.Converter({
//         tables: true,
//         emoji: true,
//         openLinksInNewWindow: true,
//         extensions: [
//             showdownHighlight,
//             customClassExt,
//             showdownCopyCode,
//             // kaytex.default({
//             //     throwOnError: false,
//             //     displayMode: true,
//             //     errorColor: "red"
//             // })
//         ]
//     });
//     converter = showdownConverter;
//     initRichConverter(convertMdToHtml);
// }