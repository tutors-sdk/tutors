import { currentCourse, currentUser } from '$lib/stores';
import { redirect } from '@sveltejs/kit';

export const load = async ({ parent }) => {
	const data = await parent();
	const supabase = data.supabase;

	const handleSignOut = async () => {
		currentCourse.set(null);
		currentUser.set(null);
		await supabase.auth.signOut();
		return {
			status: 200,
			redirect: '/'
		};
	};
};
