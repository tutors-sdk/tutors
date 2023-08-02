import { Course } from '$lib/models/course';
import { currentCourse, currentUser, studentsOnline, studentsOnlineList } from '$lib/stores';
import type { StudentLoEvent, StudentLoUpdate } from '$lib/types/metrics';
import { child, get, getDatabase, onValue, ref, off } from 'firebase/database';
import { readObj, readUser, sanitise } from '$lib/utils/firebase';
import type { Token, User, UserSummary } from '$lib/types/auth';

let canUpdate = false;

export const presenceService = {
	db: {},
	user: <User>{},
	userSummaryCache: new Map<string, UserSummary>(),
	course: Course,
	lastCourse: Course,
	students: new Map<string, StudentLoEvent>(),
	los: new Array<StudentLoEvent>(),
	listeners: new Map<string, StudentLoUpdate>(),

	startListening(key: string, listener: StudentLoUpdate) {
		this.listeners.set(key, listener);
	},

	stopListening(key: string) {
		this.listeners.delete(key);
	},

	updateListeners(kind: string, event: StudentLoEvent) {
		for (const listener of this.listeners.values()) {
			listener(kind, event);
		}
	},

	sweepAndPurge(): void {
		const losToDelete = [];
		this.los.forEach((lo) => {
			lo.timeout--;
			if (lo.timeout === 0) {
				losToDelete.push(lo);
			}
		});

		losToDelete.forEach((lo) => {
			const index = this.los.indexOf(lo);
			if (index !== -1) {
				this.los.splice(index, 1);
			}

			this.updateListeners('leave', lo);
			this.students.delete(lo.studentId);
		});

		studentsOnlineList.set([...this.los]);
		studentsOnline.set(this.los.length);
	},

	async visitUpdate(courseId: string) {
		const lo = await (await get(child(ref(this.db), `all-course-access/${courseId}/lo`))).val();
		if (lo) {
			const userId = decrypt(lo.tutorsTimeId);
			if (userId && this.user.email !== userId) {
				let user = await readUser(courseId, userId);
				if (!user) {
					// const user = await readObj(`${courseId}/users/${sanitise(userId)}`);
					user = await readUser(courseId, userId);
				}
				if (user) {
					const event: StudentLoEvent = {
						studentName: user.name,
						studentId: userId,
						studentImg: user.picture,
						courseTitle: lo.courseTitle,
						loTitle: lo.title,
						loImage: lo.img,
						loRoute: lo.subRoute,
						loIcon: lo.icon,
						timeout: 7
					};
					const studentUpdate = this.students.get(userId);
					if (!studentUpdate) {
						this.students.set(userId, event);
						this.los.push(event);
						this.updateListeners('enter', event);
					} else {
						studentUpdate.loTitle = event.loTitle;
						studentUpdate.loImage = event.loImage;
						studentUpdate.loRoute = event.loRoute;
						studentUpdate.loIcon = event.loIcon;
						studentUpdate.timeout = 7;
						this.updateListeners('update', event);
					}
					studentsOnlineList.set([...this.los]);
					studentsOnline.set(this.los.length);
				}
			}
		}
	},

	initService(course: Course) {
		setInterval(this.sweepAndPurge.bind(this), 1000 * 60);
		studentsOnline.set(0);
		studentsOnlineList.set([]);
		canUpdate = false;
		setTimeout(function () {
			canUpdate = true;
		}, 5000);
		let statusRef = ref(this.db, `all-course-access/${course.id}/visits`);
		onValue(statusRef, async () => {
			if (canUpdate) {
				await this.visitUpdate(course.id);
			}
		});
		statusRef = ref(this.db, `all-course-access/${course.id}/count`);
		onValue(statusRef, async () => {
			if (canUpdate) {
				await this.visitUpdate(course.id);
			}
		});
	},

	startPresenceEngine(session: Token) {
		this.db = getDatabase();
		currentUser.subscribe((newUser: User) => {
			this.user = newUser;
		});
		currentCourse.subscribe((newCourse: Course) => {
			if (newCourse && newCourse != this.lastCourse) {
				if (this.lastCourse) {
					const statusRef = ref(this.db, `all-course-access/${this.lastCourse.id}/visits`);
					off(statusRef);
				}
				this.lastCourse = newCourse;
				if (session && newCourse?.authLevel > 0) {
					this.initService(newCourse);
				}
			}
		});
	}
};
