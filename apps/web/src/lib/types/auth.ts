export interface User {
	userId: string;
	email: string;
	picture: string;
	name: string;
	nickname: string;
	onlineStatus: string;
}

export interface UserSummary {
	picture: string;
	name: string;
}

export type SuccessFunction = (courseId: string) => void;

interface AmrMethod {
	method: string;
	timestamp: number;
}

interface UserMetadata {
	avatar_url: string;
	email: string;
	email_verified: boolean;
	full_name: string;
	iss: string;
	name: string;
	preferred_username: string;
	provider_id: string;
	sub: string;
	user_name: string;
}

interface AppMetadata {
	provider: string;
	providers: string[];
}

export interface Token {
	aud: string;
	exp: number;
	iat: number;
	iss: string;
	sub: string;
	email: string;
	phone: string;
	app_metadata: AppMetadata;
	user_metadata: UserMetadata;
	role: string;
	aal: string;
	amr: AmrMethod[];
	session_id: string;
}
