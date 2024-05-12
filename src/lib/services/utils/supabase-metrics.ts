import { db } from "$lib/db/client";
import type { Session } from "@supabase/supabase-js";
import type { Course, Lo, WeekType } from "../models/lo-types";
import type { DayMeasure, Metric } from "../types/firebase-metrics";
import type { LearningRecord } from "../types/supabase-metrics";
import { getAllCalendarData } from "./supabase-utils";

export async function fetchStudentById(course: Course): Promise<void> {
  const { data: metrics, error: studentsError } = await db.rpc('get_all_learner_records', {
    course_base: course.courseId
  });

  if (metrics && metrics.length > 0 && course.loIndex) {
    const studentRecordsMap = new Map<string, LearningRecord[]>();
    metrics.forEach((metric: { courseid: string, loid: string, date: Date; pageloads: number; timeactive: number; studentid: string; }) => {
      course.loIndex.forEach((lo) => {
        if (metric.loid === lo.route) {
          // Create a new object without loid and studentId properties
          const learningRecord: LearningRecord = {
            date: metric.date,
            pageLoads: metric.pageloads,
            timeActive: metric.timeactive
          };
          // Check if the student ID exists in the map
          if (studentRecordsMap.has(metric.studentid)) {
            // If the student ID exists, push the modified record to its array
            studentRecordsMap.get(metric.studentid)?.push(learningRecord);
          } else {
            // If the student ID doesn't exist, create a new array with the modified record
            studentRecordsMap.set(metric.studentid, [learningRecord]);
          }
          // Find the corresponding learning record in metrics using the route
          lo.learningRecords = studentRecordsMap;
        }
      });
    });
    course.loIndex = new Map(course.los.map((lo) => [lo.route, lo]));
  }
};

// export async function fetchAllStudents(course: Course): Promise<void> {
//   //const users = new Map<string, StudentRecord>();
//   try {
//     const courseBase = course.courseId
//     const { data: metrics, error: studentsError } = await db.rpc('get_all_learner_records', {
//       course_base: course.courseId
//     });

//     if (studentsError) {
//       throw studentsError;
//     }

//     for (const metric of metrics) {
//       if (metrics && metrics.length > 0 && course.loIndex) {

//         // Iterate over each learning object in course.loIndex
//         course.loIndex.forEach((lo) => {
//           // Find the corresponding learning record in metrics using the route
//           lo.learningRecords = metrics.find((m: LearningRecord) => m.loid === lo.route);
//         });
//         course.loIndex = new Map(course.los.map((lo) => [lo.route, lo]));
//       }
//     }
    //await updateStudentMetrics(courseBase, user);
    // populateStudentCalendar(course);
    //   if (allLabs) {
    //     populateDetailedLabInfo(courseBase, user);
    //     populateStudentsLabUsage(user, allLabs);
    //   }

    //   if (allTopics) {
    //     await populateTopics(courseBase, user);
    //     await updateStudentMetricsTopicData(courseBase, user);
    //   }
    //   user.metric.metrics.forEach(item1 => {
    //     allTopics.forEach(item2 => {
    //       if (item2.route.includes(item1.route)) {
    //         item1.title = item2.title;
    //       }
    //     });
    //   });
    //   populateStudentsTopicUsage(user, allTopics);
    //   users.set(user.nickname, user);

    // }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

async function updateStudentMetrics(courseBase: string, course: Course, user: StudentRecord) {
  const { data: metrics, error: metricsError } = await db.rpc('get_learner_records', {
    user_name: user.student.nickname,
    course_base: courseBase
  });

  user.allTopics = metrics;

  if (metrics && metrics.length > 0 && course.loIndex) {
    metrics.forEach((m: LearningRecord) => {
      if (m.loid) {
        if (m.type === 'lab' || m.type === 'step') {
          let labObject = course.loIndex.get(m.loid);
          if (labObject) {
            user.allLabs.push(m);
          }
        }

        let learningObject = course.loIndex.get(m.loid);
        if (learningObject) {
          user.allTopics.push(learningObject);
        }
      }
    });
  }

  // return allLearningRecords;
  // const { data: metrics, error: metricsError } = await db.rpc('get_lab_data', {
  //   user_name: user.nickname,
  //   course_base: courseBase
  // });

  // if (metricsError) {
  //   throw metricsError;
  // }

  // user.metric = {
  //   id: 'lab',
  //   metrics: []
  // };

  // metrics.forEach((m) => {
  //   const metricObject: { [key: string]: number | string | undefined } = {};
  //   metricObject['route'] = m.lochild ? removeTrailingSlash(m.lochild) : undefined;
  //   metricObject['count'] = m.count;

  //   user.metric.metrics.push(metricObject);
  //});
}

async function updateStudentMetricsTopicData(courseBase: string, user: any) {
  const { data: metrics, error: metricsError } = await db.rpc('get_topic_data', {
    user_name: user.nickname,
    course_base: courseBase
  });

  if (metricsError) {
    throw metricsError;
  }

  user.metric = {
    id: 'topic',
    metrics: []
  };

  metrics.forEach((m) => {
    const metricObject: { [key: string]: number | string | undefined } = {};
    metricObject['route'] = m.loparent ? removeTrailingSlash(m.loparent) : undefined;
    metricObject['count'] = m.count;

    user.metric.metrics.push(metricObject);
  });
}

// async function populateStudentCalendar(course: Course, session: Session) {
//   course
//   let data = await getAllCalendarData(course.courseId, session.user.user_metadata.user_name)
//   if (data) {
//     data.forEach(item => {
//       const calendarId = item.id;
//       const weekType: WeekType = {
//         date: calendarId,
//         dateObj: Date.parse(calendarId),
//         metric: item.duration,
//       };
//       course.courseCalendar.push(dayMeasure);
//     });
//   }
// }

// async function populateStudentsLabUsage(user: StudentRecord, allLabs: Lo[]) {
//   // user.labActivity = [];
//   for (const lab of allLabs) {
//    // const labActivity: LearningRecord = findInStudent(lab.route, user);
//     user.allLabs.forEach(activity => {
//       if (lab.route === activity.loid) {
//       //if (labActivity !== null) {
//       const totalRecord: LearningObject = {
//         title: lab.title,
//         lo: [activity]
//       };
//       user.labActivity.push(totalRecord);
//     }
//   });
// }

async function populateStudentsLabUsage(user: StudentRecord, allLabs: Lo[]) {
  user.labActivity = allLabs
    .filter(lab => user.allLabs.some(activity => lab.route === activity.loid))
    .map(lab => ({
      title: lab.title,
      lo: user.allLabs.filter(activity => lab.route === activity.loid)
    }));
}

function findInStudent(title: string, user: StudentRecord) {
  return findInStudentMetrics(title, user.metric.metrics);
}

function findInStudentMetric(title: string, metric: any) {
  if (title === metric.route) {
    return metric;
  } else if (metric.metrics?.length > 0 || metric.metrics?.count > 0) {
    return findInStudentMetrics(title, metric.metrics);
  } else {
    return null;
  }
}

function findInStudentMetrics(title: string, calendar: any): Metric {
  let result: any = null;
  for (const metric of calendar) {
    if (metric.id === "ab" || metric.id === "alk" || metric.id === "ideo") {
      // console.log("ignoring spurious data"); as result of bug in types
      // since fixed, but bad data in some user dbs.
    } else {
      result = findInStudentMetric(title, metric);
      if (result != null) {
        return result;
      }
    }
  }
  return result;
}

// async function populateStudentsTopicUsage(user: StudentRecord, allTopics: Lo[]) {
//   user.topicActivity = [];
//   for (const topic of allTopics) {
//     const topicActivity: Metric = findInStudent(topic.route, user);
//     if (topicActivity !== null) {
//       topicActivity.title = topic.title;
//       user.topicActivity.push(topicActivity);
//     }
//   }
// }

// async function populateStudentsTopicUsage(user: StudentRecord, allTopics: Lo[]) {
//   user.allLearningRecords = allTopics
//     .filter(topic => user.allTopics.some(activity => topic.route === activity.loid))
//     .map(topic => {
//       const los = user.allTopics.filter(activity => topic.route === activity.loid);
//       return {
//         title: topic.title,
//         lo: los.map(lo => ({
//           loid: lo.loid,
//           courseid: lo.courseid,
//           studentid: lo.studentid,
//           date: lo.date,
//           pageLoads: lo.pageLoads,
//           timeActive: lo.timeActive,
//           type: lo.type
//         })) // Assuming you have properties like id and name for each LO
//       };
//     });
// }

async function populateStudentsTopicUsage(user: StudentRecord, allTopics: Lo[]) {
  // Group all topics by their titles
  const topicGroups = allTopics.reduce((groups, topic) => {
    const group = groups.get(topic.title) || [];
    group.push(topic);
    groups.set(topic.title, group);
    return groups;
  }, new Map<string, Lo[]>());

  // Populate user's learning records
  user.allLearningRecords = Array.from(topicGroups).map(([title, topics]) => ({
    title,
    lo: topics.flatMap(topic => user.allTopics.filter(activity => topic.route === activity.loid))
  }));
}

function removeTrailingSlash(str: string): string {
  return str.replace(/\/$/, '');
};

async function populateTopics(courseBase: string, user: StudentRecord) {
  const { data: topics, error: topicsError } = await db.rpc('get_topic_metrics_for_student', {
    user_name: user.student.nickname,
    course_base: courseBase
  });

  if (topicsError) {
    throw topicsError;
  }

  user.allTopics = topics;
};

async function populateDetailedLabInfo(courseBase: string, user: StudentRecord) {
  const { data: detailedLabInfo, error: detailedLabInfoError } = await db.rpc('get_lab_usage', {
    user_name: user.student.nickname,
    course_base: courseBase
  });

  if (detailedLabInfoError) {
    throw detailedLabInfoError;
  }
  user.labActivity = detailedLabInfo;
}
