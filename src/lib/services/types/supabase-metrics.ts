import type { Course, Lo } from "../models/lo-types";

export interface Student {
    name: string;
    email: string;
    picture: string;
    onlinestatus: boolean;
    nickname: string;
  }

  export interface DayMeasure {
    date: string;
    dateObj: number;
    metric: number;
  }
  
//   export interface LearningObject {
//     route: string;
//     type: string;
//     title: string;
//     image: string;
//     icon: string;
//     parent: string;
//     child: string;
//   }
  
  export interface LearningRecord {
    loid: string | null;
    courseid: string;
    studentid: string;
    date: Date | null;
    pageLoads: number | null;
    timeActive: number;
    type: string;
    lo: LearningRecord[];
  }
  
  export interface StudentRecord {
    student: Student;
    course: Course;
    courseAccessLog: DayMeasure[];//calendarActivity
    allLearningRecords: LearningRecord[]; //topics
    labActivity: LearningRecord[]; //filter by lab and step
    allTopics: Lo[]; //list of topics
    allLabs: Lo[]; //list of labs

  
  }


