import { apiFetch } from '@/lib/apiClient';
import type { StudentType } from '@/lib/userInfoStorage';

export interface UserMeData {
  userId: number;
  studentId: string;
  name: string;
  nickname: string;
  department: string;
  studentType: StudentType;
  role: string;
}

export const fetchMyProfile = (): Promise<UserMeData> =>
  apiFetch<UserMeData>('/api/users/me');
