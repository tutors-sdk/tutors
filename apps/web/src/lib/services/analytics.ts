import { updateLo } from '$lib/utils/course';
import type { Lo } from '$lib/types/lo';
import type { Course } from '$lib/models/course';
import type { Token, User } from '$lib/types/auth';
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

	setOnlineStatus(status: boolean, session: Token) {
		const onlineStatus = status ? 'online' : 'offline';
		const key = `${course.id}/users/${sanitise(session.user_metadata.email)}/onlineStatus`;
		updateStr(key, onlineStatus);
		user.onlineStatus = onlineStatus;
	},

	async getOnlineStatus(course: Course, session: Token): Promise<string> {
		if (!course || !user) {
			return 'online';
		}
		const courseId = course.url.substring(0, course.url.indexOf('.'));
		const key = `${courseId}/users/${sanitise(session.user_metadata.email)}/onlineStatus`;
		const status = await readValue(key);
		return status || 'online';
	},

	reportPageLoad(course: any, session: Token) {
		updateLastAccess(`${course.id}/usage/${this.loRoute}`, course.title);
		updateVisits(course.url.substring(0, course.url.indexOf('.')));

		if (!session || (session && session.onlineStatus === 'online')) {
			updateLastAccess(`all-course-access/${course.id}`, this.title);
			updateVisits(`all-course-access/${course.id}`);
			updateLo(`all-course-access/${course.id}`, course, lo);
		}

		if (user) {
			const key = `${course.url.substring(0, course.url.indexOf('.'))}/users/${sanitise(
				user.email
			)}/${this.loRoute}`;
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

	updateLogin(courseId: string, session: Token) {
		const key = `${courseId}/users/${sanitise(session.user_metadata.email)}`;
		updateStr(`${key}/email`, session.user_metadata.email);
		updateStr(`${key}/name`, session.user_metadata.full_name);
		updateStr(`${key}/id`, session.sub);
		updateStr(`${key}/nickname`, session.user_metadata.preferred_username);
		updateStr(`${key}/picture`, session.user_metadata.avatar_url);
		updateStr(`${key}/last`, new Date().toString());
		updateCountValue(`${key}/count`);
	}
};
