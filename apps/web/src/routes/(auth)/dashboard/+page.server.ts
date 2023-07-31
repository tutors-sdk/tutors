import { redirect } from '@sveltejs/kit';

export const load = async ({ locals: { supabase, getSession } }) => {
	const session = await getSession();

	if (!session) {
		throw redirect(303, '/auth');
	}

	const { data: courses } = await supabase
		.from('accessed_courses')
		.select(`course_list`)
		.eq('id', session.user.id);

	return { session, courses };
};
