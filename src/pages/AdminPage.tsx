import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { updateClubStatus, type ClubStatusUpdate } from '@/lib/api/club';
import { fetchMyProfile } from '@/lib/api/user';

const CLUBS = [
  { clubId: 1, clubName: '활주로' },
  { clubId: 2, clubName: '올뮤' },
  { clubId: 3, clubName: '에어락' },
  { clubId: 4, clubName: '재징유' },
  { clubId: 5, clubName: '우리부모' },
  { clubId: 6, clubName: '줄울림' },
  { clubId: 7, clubName: '나상현씨밴드' },
  { clubId: 8, clubName: '창모' },
  { clubId: 9, clubName: '비비' },
  { clubId: 10, clubName: '광대와끼' },
  { clubId: 11, clubName: '알피네' },
  { clubId: 12, clubName: '랩플레인' },
  { clubId: 13, clubName: '도스' },
  { clubId: 14, clubName: '카더가든' },
  { clubId: 15, clubName: '에이핑크' },
  { clubId: 16, clubName: '에어비트' },
];

const CLUB_STATUS_OPTIONS: { value: ClubStatusUpdate; label: string; description: string }[] = [
  { value: 'LIVE', label: 'LIVE', description: '공연 진행 중' },
  { value: 'END', label: 'END', description: '공연 종료' },
];

const AdminPage = () => {
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['user', 'me'],
    queryFn: fetchMyProfile,
  });

  // 클럽 상태
  const [selectedClubId, setSelectedClubId] = useState<number | null>(null);
  const [selectedClubStatus, setSelectedClubStatus] = useState<ClubStatusUpdate | null>(null);
  const [clubSuccessMsg, setClubSuccessMsg] = useState<string | null>(null);

  const clubMutation = useMutation({
    mutationFn: ({ clubId, clubStatus }: { clubId: number; clubStatus: ClubStatusUpdate }) =>
      updateClubStatus(clubId, clubStatus),
    onSuccess: () => {
      const clubName = CLUBS.find((c) => c.clubId === selectedClubId)?.clubName;
      setClubSuccessMsg(`"${clubName}" 상태가 "${selectedClubStatus}"로 변경되었습니다.`);
    },
    onError: (error: Error) => {
      setClubSuccessMsg(null);
      window.alert(`변경 실패: ${error.message}`);
    },
  });

  const handleClubConfirm = () => {
    if (!selectedClubId || !selectedClubStatus) return;
    setClubSuccessMsg(null);
    clubMutation.mutate({ clubId: selectedClubId, clubStatus: selectedClubStatus });
  };

  if (profileLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-[14px] text-gray-400">확인 중...</p>
      </div>
    );
  }

  if (profile?.role !== 'ROLE_ADMIN') {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="text-center">
          <p className="text-[18px] font-bold text-[#1e2235]">접근 권한이 없습니다</p>
          <p className="mt-2 text-[14px] text-gray-500">관리자 계정으로 로그인해주세요.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center px-4 py-12">
      <div className="w-full max-w-[400px] flex flex-col gap-6">

        {/* 공연 상태 변경 */}
        <section className="rounded-[20px] bg-white px-6 py-6 shadow-sm">
          <h2 className="mb-1 text-[20px] font-bold text-[#1e2235]">공연 상태 변경</h2>
          <p className="mb-5 text-[13px] text-gray-500">특정 동아리의 공연 상태를 변경합니다.</p>

          {/* 동아리 드롭다운 */}
          <div className="mb-4">
            <label className="mb-1.5 block text-[13px] font-semibold text-gray-600">동아리 선택</label>
            <select
              value={selectedClubId ?? ''}
              onChange={(e) => setSelectedClubId(Number(e.target.value) || null)}
              className="w-full rounded-[12px] border-2 border-gray-200 bg-white px-4 py-3 text-[15px] text-[#1e2235] focus:border-[#4362d0] focus:outline-none"
            >
              <option value="">선택해주세요</option>
              {CLUBS.map((club) => (
                <option key={club.clubId} value={club.clubId}>
                  {club.clubName}
                </option>
              ))}
            </select>
          </div>

          {/* 상태 버튼 */}
          <div className="mb-4 flex gap-3">
            {CLUB_STATUS_OPTIONS.map((option) => {
              const isSelected = selectedClubStatus === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => setSelectedClubStatus(option.value)}
                  className={`flex flex-1 items-center justify-between rounded-[14px] border-2 px-5 py-4 text-left transition-colors ${
                    isSelected
                      ? 'border-[#4362d0] bg-[#4362d0]/5'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div>
                    <p className={`text-[15px] font-bold ${isSelected ? 'text-[#4362d0]' : 'text-[#1e2235]'}`}>
                      {option.label}
                    </p>
                    <p className="text-[12px] text-gray-500">{option.description}</p>
                  </div>
                </button>
              );
            })}
          </div>

          <button
            onClick={handleClubConfirm}
            disabled={!selectedClubId || !selectedClubStatus || clubMutation.isPending}
            className={`w-full rounded-[14px] py-[14px] text-[15px] font-bold text-white transition-opacity ${
              selectedClubId && selectedClubStatus && !clubMutation.isPending
                ? 'bg-[#4362d0] active:opacity-80'
                : 'cursor-not-allowed bg-gray-300'
            }`}
          >
            {clubMutation.isPending ? '변경 중...' : '확인'}
          </button>

          {clubSuccessMsg && (
            <div className="mt-3 rounded-[12px] bg-green-50 px-4 py-3 text-[13px] font-medium text-green-700">
              ✓ {clubSuccessMsg}
            </div>
          )}
        </section>

      </div>
    </div>
  );
};

export default AdminPage;
