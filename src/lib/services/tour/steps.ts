import type { TourStep } from "./types";

export const courseReaderSteps: TourStep[] = [
  {
    target: "[data-tour='course-title']",
    titleKey: "tour.courseTitle.title",
    descriptionKey: "tour.courseTitle.description",
    placement: "bottom"
  },
  {
    target: "[data-tour='search']",
    titleKey: "tour.search.title",
    descriptionKey: "tour.search.description",
    placement: "bottom"
  },
  {
    target: "[data-tour='layout']",
    titleKey: "tour.layout.title",
    descriptionKey: "tour.layout.description",
    placement: "bottom"
  },
  {
    target: "[data-tour='profile']",
    titleKey: "tour.profile.title",
    descriptionKey: "tour.profile.description",
    placement: "bottom"
  },
  {
    target: "[data-tour='toc']",
    titleKey: "tour.toc.title",
    descriptionKey: "tour.toc.description",
    placement: "left",
    optional: true
  },
  {
    target: "[data-tour='calendar']",
    titleKey: "tour.calendar.title",
    descriptionKey: "tour.calendar.description",
    placement: "bottom",
    optional: true
  },
  {
    target: "[data-tour='info']",
    titleKey: "tour.info.title",
    descriptionKey: "tour.info.description",
    placement: "right",
    optional: true
  }
];
