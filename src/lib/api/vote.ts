import { apiFetch } from '../apiClient';

export type VoteStatus = 'YET' | 'INPROGRESS' | 'ENDED' | 'RESULT';

export const updateVoteStatus = (voteStatus: VoteStatus): Promise<void> =>
  apiFetch('/api/votes/status', {
    method: 'PATCH',
    body: { voteStatus },
  });
