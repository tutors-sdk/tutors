import type { PageLoad } from "./$types";

const validCourses = [
  "agile-2023",
  "setu-audio-production-2022",
  "classic-design-patterns",
  "bi-vis-2023",
  "careerdevelopment",
  "dsa1-jan-2024",
  "wit-hdip-comp-sci-2021-database",
  "devfor",
  "enterprise-apps",
  "fsf21",
  "funcprog23-reg",
  "hci-and-webdesign23",
  "isf23",
  "setu-mgd",
  "netfor",
  "of-2022s2-8z1",
  "osforensics",
  "ictforforestry",
  "placement-project",
  "professionalcomms",
  "wit-hdip-comp-sci-2023-programming",
  "pf2-it2-22",
  "nuist-prog-practice-22",
  "zusatzstudium-digital-skills-semester1",
  "computingclass",
  "digital-skills-semester2-github",
  "software-dev-tools-2022",
  "software-testing-nuist-2023",
  "database-fundamentals-sql",
  "wad2-2023",
  "web-design-for-ecommerce",
  "wit-hdip-comp-sci-2023-web-dev-1",
  "web-dev-2-2023",
  "web-programming",
  "webdev1-22",
  "website-development-2",
  "adv-full-stack-oth-2023",
  "business-analytics2-2023",
  "wit-hdip-comp-sci-2022-computer-systems",
  "wit-hdip-comp-sci-2022-security",
  "wit-hdip-comp-sci-2022-devops",
  "ict-for-scientists",
  "iot-protocols-2022",
  "wit-hdip-comp-sci-2022-mobile-app-dev",
  "prog-fund-1-nuist-sept-2023",
  "project2-2022",
  "relational-databases-2023",
  "wad2-2022-setu",
  "wit-hdip-comp-sci-2023-workshop-2-4",
  "wit-hdip-comp-sci-2023-workshop-1-3",
  "mobile-app-dev-tutors-2022",
  "wit-hdip-comp-sci-2022",
  "life-etc2022"
];

export const load: PageLoad = async ({ params }) => {
  return {
    allCourses: validCourses
  };
};

export default validCourses;