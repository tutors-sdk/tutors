import type { Course, Lo } from "../models/lo-types";

export interface Student {
    name: string;
    email: string;
    picture: string;
    onlinestatus: boolean;
    nickname: string;
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
    //lo: Lo;
  }
  
  export interface StudentRecord {
    student: Student;
    course: Course;
    courseAccessLog: LearningRecord[];//calendarActivity
    allLearningRecords: LearningRecord[]; //topics
    labActivity: LearningRecord[]; //filter by lab and step
    allTopics: Lo[]; //list of topics
    alllLabs: Lo[]; //list of labs

  
  }


