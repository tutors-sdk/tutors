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
  
  export interface LearningRecordSet {
    lo: Lo;//this will hold title that we need
    learnerRecords: LearningRecord[];
  }
  
  export interface LearningRecord {
    //loid?: string;
    courseid: string;
    //studentid: string;
    date: Date;
    pageLoads: number;
    timeActive: number;
    //lo: Lo;
  }
  
//   export interface StudentRecord {
//     student: Student;
//     course: Course;
//     courseAccessLog: DayMeasure[];//calendarActivity
//     allLearningRecords: LearningRecordSet[]; //topics
//     labActivity: LearningRecordSet[]; //filter by lab and step
//     allTopics: LearningRecord[]; //list of topics
//     allLabs: LearningRecord[]; //list of labs
//   }


