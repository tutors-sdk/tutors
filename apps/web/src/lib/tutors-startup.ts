import { page } from '$app/stores';
import { authService } from '$lib/services/auth';
import { get } from 'svelte/store';
import { transitionKey, currentCourse, authenticating } from '$lib/stores';
import { presenceService } from '$lib/services/presence';
import { initFirebase } from '$lib/utils/firebase';
import { getKeys } from '$lib/environment';
import { goto } from '$app/navigation';

export async function initServices() {
	if (getKeys().firebase.apiKey !== 'XXX') {
		initFirebase(getKeys().firebase);
		authService.setCredentials(getKeys().auth0);
		presenceService.startPresenceEngine();
		const pageVal = get(page);
		if (pageVal.url.hash) {
			if (pageVal.url.hash.startsWith('#/course')) {
				goto(pageVal.url.hash.slice(2));
			} else if (pageVal.url.hash.startsWith('#access_token')) {
				authenticating.set(true);
				const token = pageVal.url.hash.substring(pageVal.url.hash.indexOf('#') + 1);
				authService.handleAuthentication(token, (courseId) => {
					goto(`/course/${courseId}`);
				});
			}
		} else {
			if (get(currentCourse)) {
				await authService.checkAuth(get(currentCourse));
			}
		}
	}

	page.subscribe((path) => {
		if (path.url.hash.startsWith('#/course')) {
			const relPath = path.url.hash.slice(1);
			goto(relPath);
		}
		transitionKey.set(path.url.pathname);
		if (
			path.url.pathname.includes('book') ||
			path.url.pathname.includes('pdf') ||
			path.url.pathname.includes('video') ||
			path.url.pathname.includes('note')
		) {
			transitionKey.set('none');
		}
	});
}