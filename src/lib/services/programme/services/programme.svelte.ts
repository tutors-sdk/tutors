import { determineCourseUrl } from "$lib/services/course/services/lo-tree";
import type { Programme, ProgrammeCourseSummary, ProgrammeJson } from "../types";

const programmes = new Map<string, Programme>();

function protocolFor(url: string): string {
  const isLocal = url.startsWith("localhost") || url.startsWith("192");
  return isLocal ? "http://" : "https://";
}

async function fetchCourseSummary(courseId: string, fetchFunction: typeof fetch): Promise<ProgrammeCourseSummary> {
  const { courseId: normalizedCourseId, courseUrl } = determineCourseUrl(courseId);
  const protocol = protocolFor(courseUrl);
  const response = await fetchFunction(`${protocol}${courseUrl}/tutors.json`);
  if (!response.ok) {
    throw new Error(`Failed to fetch course ${courseId}: ${response.status}`);
  }
  const data = await response.json();
  return {
    courseId: normalizedCourseId,
    title: data.title,
    summary: data.summary,
    img: data.img ? `${protocol}${courseUrl}/${data.img}` : undefined,
    icon: data.icon ?? data.properties?.icon,
    credits: data.properties?.credits,
    route: `/course/${normalizedCourseId}`
  };
}

export const programmeService = {
  async readProgramme(programmeId: string, fetchFunction: typeof fetch): Promise<Programme> {
    let programme = programmes.get(programmeId);
    if (programme) return programme;

    const { courseId: normalizedId, courseUrl } = determineCourseUrl(programmeId);
    const protocol = protocolFor(courseUrl);

    const response = await fetchFunction(`${protocol}${courseUrl}/programme.json`);
    if (!response.ok) {
      throw new Error(`Failed to fetch programme: ${response.status}`);
    }
    const programmeJson: ProgrammeJson = await response.json();

    const courseResults = await Promise.allSettled(
      programmeJson.courses.map((courseId) => fetchCourseSummary(courseId, fetchFunction))
    );

    const courses: ProgrammeCourseSummary[] = courseResults
      .filter((r): r is PromiseFulfilledResult<ProgrammeCourseSummary> => r.status === "fulfilled")
      .map((r) => r.value);

    programme = {
      programmeId: normalizedId,
      title: programmeJson.title,
      summary: programmeJson.summary,
      img: programmeJson.img ? `${protocol}${courseUrl}/${programmeJson.img}` : undefined,
      icon: programmeJson.icon,
      properties: programmeJson.properties,
      courses
    };

    programmes.set(normalizedId, programme);
    return programme;
  }
};
