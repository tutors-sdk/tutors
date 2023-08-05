import { courseService } from '$lib/services/course';
import type { Course } from '$lib/models/course';
import { currentLo } from '$lib/stores';

export const ssr = false;

export const load = async ({ params, parent }) => {
	const course: Course = await courseService.readCourse(params.courseid);

	const data = await parent();

	console.log(data);

	if (!data.session) {
		currentLo.set(course.lo);
		return {
			course,
			lo: course.lo
		};
	}

	if (data.session) {
		const { data: userCourseList } = await data.supabase
			.from('accessed_courses')
			.select(`course_list`)
			.eq('id', data.session.user.id);

		const courseList = userCourseList[0].course_list;

		const courseIndex = courseList.courses.findIndex((c) => c.id === course.id);

		if (courseIndex === -1) {
			courseList.courses.push({
				id: course.id,
				name: course.lo.title,
				last_accessed: new Date().toISOString(),
				visits: 1
			});
		} else {
			courseList.courses[courseIndex].last_accessed = new Date().toISOString();
			courseList.courses[courseIndex].visits++;
		}

		console.log(courseList);

		await data.supabase
			.from('accessed_courses')
			.update({ course_list: courseList })
			.eq('id', data.session.user.id);

		currentLo.set(course.lo);

		return {
			course,
			lo: course.lo,
			userCourseList
		};
	}
};
