import { updateLo } from '$lib/utils/course';
import type { Lo } from '$lib/types/lo';
import type { Course } from '$lib/models/course';
import type { User } from '$lib/types/auth';
import { currentCourse, currentLo, currentUser } from '$lib/stores';

import {
	readValue,
	sanitise,
	updateCalendar,
	updateCount,
	updateCountValue,
	updateLastAccess,
	updateStr,
	updateVisits
} from '$lib/utils/firebase';

let course: Course;
let user: User;
let lo: Lo;

currentCourse.subscribe((current) => {
	course = current;
});
currentUser.subscribe((current) => {
	user = current;
});
currentLo.subscribe((current) => {
	lo = current;
});

export const analyticsService = {
	loRoute: '',

	learningEvent(params: Record<string, string>) {
		if (params.loid) {
			this.loRoute = sanitise(params.loid);
		}
		this.reportPageLoad();
	},

	setOnlineStatus(status: boolean) {
		const onlineStatus = status ? 'online' : 'offline';
		const key = `${course.id}/users/${sanitise(user.email)}/onlineStatus`;
		updateStr(key, onlineStatus);
		user.onlineStatus = onlineStatus;
	},

	async getOnlineStatus(course: Course, user: User): Promise<string> {
		if (!course || !user) {
			return 'online';
		}
		this.user = user;
		this.courseId = course.url.substring(0, course.url.indexOf('.'));
		const key = `${this.courseId}/users/${sanitise(user.email)}/onlineStatus`;
		const status = await readValue(key);
		return status || 'online';
	},

	reportPageLoad() {
		updateLastAccess(`${course.id}/usage/${this.loRoute}`, this.title);
		updateVisits(this.courseId);

		if (!user || (user && user.onlineStatus === 'online')) {
			updateLastAccess(`all-course-access/${course.id}`, this.title);
			updateVisits(`all-course-access/${course.id}`);
			updateLo(`all-course-access/${course.id}`, course, lo);
		}

		if (user) {
			const key = `${this.courseId}/users/${sanitise(user.email)}/${this.loRoute}`;
			updateLastAccess(key, lo.title);
			updateVisits(key);
		}
	},

	updatePageCount() {
		updateLastAccess(`${course.id}/usage/${this.loRoute}`, this.title);
		updateCount(course.id);
		if (user) {
			updateCount(`all-course-access/${course.id}`);
			if (user.onlineStatus === 'online') {
				updateLo(`all-course-access/${course.id}`, course, lo);
			}
			const key = `${course.id}/users/${sanitise(user.email)}/${this.loRoute}`;
			updateLastAccess(key, lo.title);
			updateCount(key);
			updateCalendar(`${course.id}/users/${sanitise(user.email)}`);
		}
	},

	updateLogin(courseId: string, user: User) {
		const key = `${courseId}/users/${sanitise(user.email)}`;
		updateStr(`${key}/email`, user.email);
		updateStr(`${key}/name`, user.name);
		updateStr(`${key}/id`, user.userId);
		updateStr(`${key}/nickname`, user.nickname);
		updateStr(`${key}/picture`, user.picture);
		updateStr(`${key}/last`, new Date().toString());
		updateCountValue(`${key}/count`);
	}
};
