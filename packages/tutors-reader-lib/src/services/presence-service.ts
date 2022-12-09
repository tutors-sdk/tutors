import type { refreshStudents, StatusChange, StudentMetric } from "../types/metrics-types";
import type { MetricsService } from "./metrics-service";
import type { Topic } from "../models/topic";
import type { Lo } from "../types/lo-types";
import type { Course } from "../models/course";
import { studentsOnline } from "../stores/stores";

function compareStudents(student1: StudentMetric, student2: StudentMetric): number {
  if (!student1.lab) {
    return -1;
  }
  if (student1.lab && student2.lab) {
    return student1.lab.title.localeCompare(student2.lab.title);
  }
  return 0;
}

export class PresenceService {
  students: StudentMetric[] = [];
  metricsService: MetricsService;
  refresh: refreshStudents;
  refreshStatus: StatusChange;

  constructor(metricsService: MetricsService, students: StudentMetric[], refresh: refreshStudents, refreshStatus: StatusChange) {
    this.metricsService = metricsService;
    this.students = students;
    this.refresh = refresh;
    this.refreshStatus = refreshStatus;
  }

  setCourse(course: Course) {
    this.metricsService.setCourse(course);
  }

  async start() {
    await this.metricsService.subscribeToAllUsers();
    this.metricsService.startListening(this.metricUpdate.bind(this), this.metricDelete.bind(this), this.statusChange.bind(this));
    this.students = [];
  }

  stop() {
    this.metricsService.stopService();
    this.metricsService.stopListening();
  }

  statusChange(user: User) {
    if (this.refreshStatus) this.refreshStatus(user);
  }

  metricDelete(user: User) {
    const student = this.students.find((student) => student.nickname === user.nickname);
    const index = this.students.indexOf(student);
    if (index !== -1) {
      this.students.splice(index, 1);
    }
    if (this.refresh) this.refresh(this.students);
    studentsOnline.set(this.students.length);
  }

  metricUpdate(user: User, topic: Topic, lab: Lo, time: number) {
    if (user.onlineStatus === "offline") return;
    let student = this.students.find((student) => student.nickname === user.nickname);
    if (!student) {
      student = {
        name: user.name,
        nickname: user.nickname,
        img: user.picture,
        topic: undefined,
        lab: undefined,
        time: time
      };
      this.students.push(student);
    }
    student.time = time;
    if (topic) {
      student.topic = topic;
    }
    if (lab) {
      student.lab = lab;
    }
    this.students?.sort(compareStudents);
    if (this.refresh) this.refresh(this.students);
    studentsOnline.set(this.students.length);
  }
}
