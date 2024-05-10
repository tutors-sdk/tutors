import { db } from "$lib/db/client";
import type { Session } from "@supabase/supabase-js";
import type { Course, Lo } from "../models/lo-types";
import type { UserMetric, DayMeasure, Metric } from "../types/firebase-metrics";
import type { LearningRecord, StudentRecord } from "../types/supabase-metrics";
import { getAllCalendarData } from "./supabase-utils";

export async function fetchStudentById(course: Course, session: Session, allLabs, allTopics): Promise<StudentRecord | null> {
  let user: StudentRecord = {
    student: {
      name: "",
      email: "",
      picture: "",
      onlinestatus: false,
      nickname: ""
    },
    course: course,
    courseAccessLog: [],
    allLearningRecords: [],
    labActivity: [],
    allTopics: [],
    alllLabs: []
  };
  const courseBase = course.courseId;
  const { data: student, error: studentError } = await db.rpc('fetch_course_overview_for_student', {
    user_name: session.user.user_metadata.user_name,
    course_base: course.courseId
  });

  if (studentError) {
    throw studentError;
  }

  user.student = student[0];
  if (user) {
    await updateStudentMetrics(courseBase, course, user);
    populateStudentCalendar(courseBase, user);
    if (allLabs) {
      populateDetailedLabInfo(courseBase, user);
      populateStudentsLabUsage(user, allLabs);
    }

    if (allTopics) {
      await populateTopics(courseBase, user);
      await updateStudentMetricsTopicData(courseBase, user);

      user.metric.metrics.forEach(item1 => {
        allTopics.forEach(item2 => {
          if (item2.route.includes(item1.route)) {
            item1.title = item2.title;
          }
        });
      });
      populateStudentsTopicUsage(user, allTopics);
    }
    return user;
  } else {
    return null;
  }
};

export async function fetchAllStudents(courseUrl: string, allLabs, allTopics): Promise<Map<string, StudentRecord>> {
  let user = null;
  const users = new Map<string, StudentRecord>();
  try {
    const courseBase = courseUrl.substring(0, courseUrl.indexOf("."));
    const { data: students, error: studentsError } = await db.rpc('fetch_course_overview_for_students', {
      course_base: courseBase
    });

    if (studentsError) {
      throw studentsError;
    }

    for (const student of students) {
      user = student;
      await updateStudentMetrics(courseBase, user);
      populateStudentCalendar(courseBase, user);
      if (allLabs) {
        populateDetailedLabInfo(courseBase, user);
        populateStudentsLabUsage(user, allLabs);
      }

      if (allTopics) {
        await populateTopics(courseBase, user);
        await updateStudentMetricsTopicData(courseBase, user);
      }
      user.metric.metrics.forEach(item1 => {
        allTopics.forEach(item2 => {
          if (item2.route.includes(item1.route)) {
            item1.title = item2.title;
          }
        });
      });
      populateStudentsTopicUsage(user, allTopics);
      users.set(user.nickname, user);

    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
  return users;
};

async function updateStudentMetrics(courseBase: string, course: Course, user: StudentRecord ) {
  const { data: metrics, error: metricsError } = await db.rpc('get_learner_records', {
    user_name: user.student.nickname,
    course_base: courseBase
  });

  user.allLearningRecords = metrics;

  if (metrics && metrics.length > 0 && course.loIndex) {
    metrics.forEach((m: LearningRecord) => {
      if (m.loid) {
        let learningObject = course.loIndex.get(m.loid);
        learningObject.timeActive = m.duration;
        if (learningObject) user.allTopics.push(learningObject);
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

async function populateStudentCalendar(courseId: string, user: UserMetric) {
  user.calendarActivity = [];
  let data = await getAllCalendarData(courseId, user.nickname)
  if (data) {
    data.forEach(item => {
      const calendarId = item.id;
      const dayMeasure: DayMeasure = {
        date: calendarId,
        dateObj: Date.parse(calendarId),
        metric: item.duration,
      };
      user.calendarActivity.push(dayMeasure);
    });
  }
}

async function populateStudentsLabUsage(user: UserMetric, allLabs: Lo[]) {
  user.labActivity = [];
  for (const lab of allLabs) {
    const labActivity = findInStudent(lab.route, user);
    if (labActivity !== null) {
      labActivity.title = lab.title;
      user.labActivity.push(labActivity);
    }
  }
}

function findInStudent(title: string, user: any) {
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

async function populateStudentsTopicUsage(user: UserMetric, allTopics: Lo[]) {
  user.topicActivity = [];
  for (const topic of allTopics) {
    const topicActivity: Metric = findInStudent(topic.route, user);
    if (topicActivity !== null) {
      topicActivity.title = topic.title;
      user.topicActivity.push(topicActivity);
    }
  }
}

function removeTrailingSlash(str: string): string {
  return str.replace(/\/$/, '');
};

async function populateTopics(courseBase: string, user: UserMetric) {
  const { data: topics, error: topicsError } = await db.rpc('get_topic_metrics_for_student', {
    user_name: user.nickname,
    course_base: courseBase
  });

  if (topicsError) {
    throw topicsError;
  }

  user.topics = topics;
};

async function populateDetailedLabInfo(courseBase: string, user: UserMetric) {
  const { data: detailedLabInfo, error: detailedLabInfoError } = await db.rpc('get_lab_usage', {
    user_name: user.nickname,
    course_base: courseBase
  });

  if (detailedLabInfoError) {
    throw detailedLabInfoError;
  }
  user.detailedLabInfo = detailedLabInfo;
}
