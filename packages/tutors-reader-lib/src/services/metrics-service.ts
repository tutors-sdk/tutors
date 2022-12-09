import type { Course } from "../models/course";
import { getDatabase, off, onValue, ref } from "firebase/database";
import type { Lo, Student } from "../types/lo-types";
import type { MetricDelete, MetricUpdate, StatusChange, User, UserMetric } from "../types/metrics-types";
import { fetchAllUsers, fetchUserById } from "../utils/metrics-utils";
import type { Topic } from "../models/topic";
import { updateStr } from "../utils/firebase-utils";

export class MetricsService {
  course: Course | undefined;
  users = new Map<string, UserMetric>();
  userRefresh = new Map<string, number>();
  allLabs: Lo[] = [];
  courseId = "";
  metricUpdate: MetricUpdate | undefined;
  metricDelete: MetricDelete | undefined;
  statusChange: StatusChange | undefined;
  canUpdate = false;

  setCourse(course: Course) {
    this.course = course;
    this.courseId = course.url.substring(0, course.url.indexOf("."));
    this.allLabs = this.course.walls.get("lab");
    setInterval(this.sweepAndPurge.bind(this), 1000 * 120);
  }

  diffMinutes(dt2: number, dt1: number) {
    let diff = (dt2 - dt1) / 1000;
    diff /= 60;
    return Math.abs(Math.round(diff));
  }

  sweepAndPurge() {
    this.userRefresh.forEach((timeStamp, nickname) => {
      const diff = this.diffMinutes(timeStamp, Date.now());
      if (diff >= 5) {
        this.userRefresh.delete(nickname);
        if (this.metricDelete) {
          this.metricDelete(this.users.get(nickname));
        }
      }
    });
  }

  getLiveCount() {
    return this.userRefresh.size;
  }

  getLiveUsers(): User[] {
    const users: User[] = [];
    this.userRefresh.forEach((value, nickname) => {
      const user = this.users.get(nickname);
      users.push(user);
    });
    return users;
  }

  userUpdate(user: User) {
    const timeStamp = Date.now();
    this.userRefresh.set(user.nickname, timeStamp);
    // studentsOnline.set(this.userRefresh.size);
  }

  userOnlineStatusChange(user: User, status: string) {
    if (!this.canUpdate) return;
    if (status === "offline") {
      user.onlineStatus = status;
      if (this.statusChange) this.statusChange(user);
      const student = this.userRefresh.get(user.nickname);
      this.userUpdate(user);
      if (student) {
        this.userRefresh.delete(user.nickname);
        if (this.metricDelete) {
          this.metricDelete(this.users.get(user.nickname));
        }
      }
    } else {
      user.onlineStatus = "online";
      if (this.statusChange) this.statusChange(user);
      this.userUpdate(user);
    }
  }

  metricChange(user: User, topic: Topic, lab: Lo) {
    if (!this.canUpdate) return;
    this.userUpdate(user);
    if (this.metricUpdate) {
      this.metricUpdate(user, topic, lab, Date.now());
    }
  }

  async fetchUserById(userId: string) {
    const user: User = await fetchUserById(this.course.url, userId, this.allLabs);
    // eslint-disable-next-line no-prototype-builtins
    if (!user.hasOwnProperty("onlineStatus")) user.onlineStatus = "online";
    return user;
  }

  async fetchAllUsers() {
    return await fetchAllUsers(this.course.url, this.allLabs);
  }

  filterUsers(users: Map<string, UserMetric>, students: Student[]) {
    const enrolledUsersMap = new Map<string, Student>();
    students.forEach((student) => {
      enrolledUsersMap.set(student.github, student);
    });
    users.forEach((user) => {
      const student = enrolledUsersMap.get(user.nickname);
      if (student) {
        user.name = student.name;
      } else {
        users.delete(user.nickname);
      }
    });
    return users;
  }

  startListening(metricUpdate: MetricUpdate, metricDelete: MetricDelete, statusChange: StatusChange) {
    this.metricUpdate = metricUpdate;
    this.metricDelete = metricDelete;
    this.statusChange = statusChange;
  }

  stopListening() {
    this.metricUpdate = null;
    this.metricDelete = null;
  }

  async subscribeToAllUsers() {
    try {
      this.users = await fetchAllUsers(this.course.url, this.allLabs);
      this.canUpdate = false;
      const func = () => {
        this.canUpdate = true;
      };
      setTimeout(func, 20 * 1000);
      this.users.forEach((user) => {
        // eslint-disable-next-line no-useless-escape
        const userEmailSanitised = user.email.replace(/[`#$.\[\]\/]/gi, "*");
        if (this.allLabs) this.subscribeToUserLabs(user, userEmailSanitised);
        if (this.course.topics) this.subscribeToUserTopics(user, userEmailSanitised);
        this.subscribeToUserStatus(user, userEmailSanitised);
      });
    } catch (e) {
      console.log("no users yet");
    }
  }

  // setOnlineStatus(user: User, status: boolean) {
  //   // eslint-disable-next-line no-useless-escape
  //   const userEmailSanitised = user.email.replace(/[`#$.\[\]\/]/gi, "*");
  //   const firebaseEmailRoot = `${this.courseId}/users/${userEmailSanitised}`;
  //   if (status) {
  //     updateStr(`${firebaseEmailRoot}/onlineStatus`, "online");
  //     user.onlineStatus = "online";
  //   } else {
  //     user.onlineStatus = "offline";
  //     updateStr(`${firebaseEmailRoot}/onlineStatus`, "offline");
  //   }
  // }

  stopService() {
    this.users.forEach((user) => {
      // eslint-disable-next-line no-useless-escape
      const userEmailSanitised = user.email.replace(/[`#$.\[\]\/]/gi, "*");
      this.unsubscribeToUserLabs(user, userEmailSanitised);
      this.unsubscribeToUserTopics(user, userEmailSanitised);
    });
  }

  subscribeToUserStatus(user: User, email: string) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;
    const db = getDatabase();
    const statustRef = ref(db, `${this.courseId}/users/${email}/onlineStatus`);
    onValue(statustRef, (snapshot) => {
      that.userOnlineStatusChange(user, snapshot.val());
    });
  }

  subscribeToUserLabs(user: User, email: string) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;
    this.allLabs.forEach((lab) => {
      const labRoute = lab.route.split("topic");
      const route = `${this.courseId}/users/${email}/topic${labRoute[1]}`;
      const db = getDatabase();
      const labRef = ref(db, route);
      onValue(labRef, () => {
        that.metricChange(user, null, lab);
      });
    });
  }

  subscribeToUserTopics(user: User, email: string) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;
    const topics = this.course.topics;

    topics.forEach((topic) => {
      const route = `${this.courseId}/users/${email}/${topic.lo.id}`;
      const db = getDatabase();
      const topicRef = ref(db, route);
      onValue(topicRef, (snapshot) => {
        const datum = snapshot.val();
        if (datum && datum.title) {
          that.metricChange(user, topic, null);
        }
      });
    });
  }

  unsubscribeToUserLabs(user: User, email: string) {
    this.allLabs.forEach((lab) => {
      const labRoute = lab.route.split("topic");
      const route = `${this.courseId}/users/${email}/topic${labRoute[1]}`;
      const db = getDatabase();
      const labRoutesRef = ref(db, route);
      off(labRoutesRef);
    });
  }

  unsubscribeToUserTopics(user: User, email: string) {
    const topics = this.course.topics;
    topics.forEach((topic) => {
      const route = `${this.courseId}/users/${email}/${topic.lo.id}`;
      const db = getDatabase();
      const topicRoutesRef = ref(db, route);
      off(topicRoutesRef);
    });
  }
}
