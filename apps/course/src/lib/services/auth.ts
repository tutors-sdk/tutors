import { analyticsService } from '$lib/services/analytics';
import { currentUser } from '$lib/stores';
import { WebAuth } from 'auth0-js';
import type { Course } from '$lib/models/course';
import {
	encrypt,
	fromLocalStorage,
	isAuthenticated,
	setSession,
	toLocalStorage
} from '$lib/utils/auth';
import type { SuccessFunction } from '$lib/types/auth';

export const authService = {
	auth0: {},

	setCredentials(credentials: any) {
		this.auth0 = new WebAuth({
			domain: credentials.customdomain,
			clientID: credentials.clientId,
			redirectUri: credentials.redirectUri,
			audience: `https://${credentials.domain}/userinfo`,
			responseType: 'token id_token',
			scope: 'openid'
		});
	},

	async loadUser(course: Course) {
		const user = fromLocalStorage();
		user.onlineStatus = await analyticsService.getOnlineStatus(course, user);
		currentUser.set(user);
		analyticsService.updateLogin(course.id, user);
	},

	async checkAuth(course: Course) {
		if (course.authLevel > 0) {
			if (!isAuthenticated()) {
				localStorage.setItem('course_url', course.url);
				this.login(this.auth0);
				return false;
			} else {
				this.loadUser(course);
			}
		}
		return true;
	},

	async handleAuthentication(result: string, success: SuccessFunction): Promise<void> {
		const authResult = new URLSearchParams(result);
		const accessToken = authResult.get('access_token');
		const idToken = authResult.get('id_token');

		if (accessToken && idToken) {
			try {
				const user = await this.getUserInfo(accessToken);
				toLocalStorage(user);

				const url = localStorage.getItem('course_url');
				const courseId = url.replace('.netlify.app', '');
				analyticsService.updateLogin(courseId, user);

				user.userId = encrypt(user.email);
				setSession(authResult);
				success(url);
			} catch (err) {
				console.log('Error loading the Profile', err);
			}
		}
	},

	async getUserInfo(accessToken: string): Promise<any> {
		return new Promise((resolve, reject) => {
			this.auth0.client.userInfo(accessToken, (err: any, user: any) => {
				if (err) {
					reject(err);
				} else {
					resolve(user);
				}
			});
		});
	},

	login(auth0) {
		auth0.authorize({ prompt: 'login', scope: 'openid profile email' });
	}
};
