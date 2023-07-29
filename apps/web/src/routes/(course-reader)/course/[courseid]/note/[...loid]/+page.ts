import type { PageLoad } from './$types';
import { courseService } from '$lib/services/course';

export const ssr = false;

export const load: PageLoad = async ({ url, params }) => {
	const lo = await courseService.readLo(params.courseid, url.pathname);
	return {
		lo: lo
	};
};
