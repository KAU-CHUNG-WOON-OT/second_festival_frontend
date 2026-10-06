import { apiFetch } from '@/lib/apiClient';

export type SingerVoteStatus = 'YET' | 'INPROGRESS' | 'ENDED' | 'RESULT';

export interface SingerVoteItem {
  singerId: number;
  singerName: string;
  songName: string;
  voteStatus: SingerVoteStatus;
}

export interface SingerVoteResult {
  voteId: number;
  userId: number;
  singerId: number;
  singerName: string;
  role: string;
}

export interface VoteResultItem {
  singerId: number;
  singerName: string;
  voteCount: number;
}

export interface VoteResultResponse {
  singerCount: number;
  results: VoteResultItem[];
}

export const fetchSingerVoteList = (): Promise<SingerVoteItem[]> =>
  apiFetch<SingerVoteItem[]>('/api/votes/singers');

export const submitSingerVote = (singerId: number): Promise<SingerVoteResult> =>
  apiFetch<SingerVoteResult>(`/api/votes/${singerId}`, { method: 'POST' });

export const fetchVoteResults = (): Promise<VoteResultResponse> =>
  apiFetch<VoteResultResponse>('/api/votes');
