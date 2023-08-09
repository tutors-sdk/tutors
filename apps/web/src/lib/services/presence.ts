import type { RealtimeChannel, SupabaseClient } from '@supabase/supabase-js';
import { studentsOnline, studentsOnlineList } from '$lib/stores';
import type { Presence } from '$lib/types/presence';

let presenceChannel: RealtimeChannel;

export function setupPresence(supabase: SupabaseClient, courseid: string) {
	presenceChannel = supabase.channel('online-users', {
		config: {
			presence: {
				key: courseid
			}
		}
	});
}

export function updatePresence(presence: Presence) {
	presenceChannel.track({
		online_at: new Date().toISOString(),
		studentName: presence.studentName,
		studentEmail: presence.studentEmail,
		studentImg: presence.studentImg,
		courseTitle: presence.courseTitle,
		loTitle: presence.loTitle,
		loImage: presence.loImage,
		loRoute: presence.loRoute,
		loIcon: presence.loIcon
	});
}

export function subscribePresence(presence: Presence, courseid: string) {
	try {
		presenceChannel.subscribe(async (status) => {
			if (status === 'SUBSCRIBED') {
				await presenceChannel.track({
					online_at: new Date().toISOString(),
					studentName: presence.studentName,
					studentEmail: presence.studentEmail,
					studentImg: presence.studentImg,
					courseTitle: presence.courseTitle,
					loTitle: presence.loTitle,
					loImage: presence.loImage,
					loRoute: presence.loRoute,
					loIcon: presence.loIcon
				});
			}
		});
	} catch (error) {
		return error;
	}

	presenceChannel.on('presence', { event: 'sync' }, () => {
		const presenceState = presenceChannel.presenceState();
		const onlineUsersObj = Object.entries(presenceState)
			.filter(([key, _]) => key === courseid)
			.map(([, value]) => value[0]);

		studentsOnline.set(onlineUsersObj.length);
		studentsOnlineList.set(onlineUsersObj);
	});

	presenceChannel.on('presence', { event: 'join' }, ({ newPresences }) => {
		studentsOnline.update((count) => count + newPresences.length);
		studentsOnlineList.update((list) => [...list, ...newPresences]);
	});

	presenceChannel.on('presence', { event: 'leave' }, ({ leftPresences }) => {
		studentsOnline.update((count) => count - leftPresences.length);
		studentsOnlineList.update((list) =>
			list.filter((item) => !leftPresences.includes(item.studentEmail))
		);
	});
}

export function unsubscribePresence() {
	presenceChannel.untrack().then(() => {
		console.log('untrack');
	});
}
