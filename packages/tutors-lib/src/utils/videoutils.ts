import * as fs from "fs";

export interface VideoIdentifier {
  service: string;
  id: string;
}

export interface VideoIdentifiers {
  videoid: string;
  videoIds: VideoIdentifier[];
}

export function readVideoIds(): VideoIdentifiers {
  const videos: VideoIdentifiers = {
    videoid: "",
    videoIds: [],
  };

  if (fs.existsSync("videoid")) {
    const entries = fs.readFileSync("videoid").toString().split("\n");

    entries.forEach((entry) => {
      if (entry !== "") {
        if (entry.includes("heanet") || entry.includes("vimp")) {
          videos.videoIds.push(parseProperty(entry));
        } else {
          videos.videoid = entry;
          videos.videoIds.push({ service: "youtube", id: entry });
        }
      }
    });
  }
  if (videos.videoIds.length > 0) {
    videos.videoid = videos.videoIds[videos.videoIds.length - 1].id;
  }
  return videos;
}

function parseProperty(nv: string): VideoIdentifier {
  const nameValue = nv.split("=");
  nameValue[0] = nameValue[0].replace("\r", "");
  nameValue[1] = nameValue[1].replace("\r", "");
  return { service: nameValue[0], id: nameValue[1] };
}
