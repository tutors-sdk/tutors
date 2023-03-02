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
