import * as fs from "node:fs";
import * as path from "node:path";
import { copyFolder } from "../utils/file-utils.ts";

let destVentoDir = "";
//const srcVentoDir = "https://raw.githubusercontent.com/tutors-sdk/tutors-cli/refs/heads/master/tutors-gen-lib/src/templates/vento/";

const srcVentoDir = "https://raw.githubusercontent.com/tutors-sdk/tutors-apps/refs/heads/development/cli/tutors-gen-lib/src/templates/vento/";

const filesToDownload = [
  'components/cards/Card.vto',
  'components/cards/CardDeck.vto',
  'components/cards/CompositeCard.vto',
  'components/cards/Image.vto',
  'components/cards/NoteCard.vto',
  'components/cards/PanelCards.vto',
  'components/cards/TalkCard.vto',
  'components/cards/UnitCard.vto',
  'components/cards/VideoCard.vto',
  'components/iconography/Icon.vto',
  'components/navigators/MainNavigator.vto',
  'components/navigators/LoContext.vto',
  'components/navigators/LoReference.vto',
  'components/navigators/support/Breadcrumbs.vto',
  'components/navigators/support/Companions.vto',
  'components/navigators/support/TitleCard.vto',
  'components/navigators/support/Walls.vto',
  'components/navigators/support/Toc.vto',
  'components/navigators/support/Info.vto',
  'components/navigators/support/TocButton.vto',
  'components/navigators/support/InfoButton.vto',
  'Composite.vto',
  'Lab.vto',
  'Talk.vto',
  'layouts/main.vto',
  'Note.vto',
  'Topic.vto',
  'Wall.vto'
];

async function downloadFile(filePath: string) {
  try {
    const url = `${srcVentoDir}${filePath}`;
    const targetPath = path.join(destVentoDir, filePath);
    const targetDir = path.dirname(targetPath);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const content = await response.text();
    fs.writeFileSync(targetPath, content);
  }
  catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`Error downloading ${filePath}: ${errorMessage}`);
    throw error;
  }
}

export async function downloadVentoTemplates(folder: string, srcVentoFolder: string = "") {
  if (srcVentoFolder) {
    copyFolder(srcVentoFolder, `${folder}/vento`);
    return;
  }
  try {
    destVentoDir = path.join(folder, 'vento');
    await Promise.all(filesToDownload.map(downloadFile));
  } catch (error) {
    console.error('Error downloading vento templates:', error);
    throw error;
  }
}