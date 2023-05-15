import { payloadSlateToDomConfig, slateToHtml } from "slate-serializers";
import { Element } from "domhandler";

export const getContentArray = (content: any) => {
  const html = slateToHtml(content, {
    ...payloadSlateToDomConfig,
    elementTransforms: {
      ...payloadSlateToDomConfig.elementTransforms,
      upload: ({ node }) =>
        // @ts-ignore
        new Element("img", {
          src: node.value.filename,
          width: `${node.value.width}`,
          height: `${node.value.height}`,
        }),
    },
  }).replaceAll("<p></p>", "<p>&nbsp;</p>");
  const htmlImageArray: (
    | string
    | { src: string; width: number; height: number }
  )[] = [];
  let lastIndex = 0;
  while (true) {
    const imgStartIndex = html.indexOf("<img", lastIndex);
    if (imgStartIndex === -1) {
      htmlImageArray.push(html.substring(lastIndex));
      break;
    }
    const imgEndIndex = html.indexOf(">", imgStartIndex) + 1;
    const imgTag = html.substring(imgStartIndex, imgEndIndex);
    const remainingHtml = html.substring(lastIndex, imgStartIndex);
    const imgObject = {
      src: imgTag.match(/src="(.*?)"/)![1],
      width: +imgTag.match(/width="(.*?)"/)![1],
      height: +imgTag.match(/height="(.*?)"/)![1],
    };
    htmlImageArray.push(remainingHtml, imgObject);
    lastIndex = imgEndIndex;
  }
  return htmlImageArray;
};
