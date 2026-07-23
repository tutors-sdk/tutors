import { programmeService } from "$lib/services/programme";

export const ssr = false;

export const load = async ({ params, fetch }) => {
  const programme = await programmeService.readProgramme(params.programmeid, fetch);
  return { programme };
};
