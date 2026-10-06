import { useEffect, useState } from 'react';
import { FiAlertCircle, FiCheck, FiCheckCircle, FiInfo } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import DayHeader from '../components/common/DayHeader';
import {
  fetchSingerVoteList,
  submitSingerVote,
  type SingerVoteItem,
} from '../lib/api/maskedSinger';
import { ApiError } from '../lib/apiClient';
import { getCurrentVote, setCurrentVote } from '../lib/maskedSingerStorage';
import { useMaskedSingerStatusStream } from '../hooks/useMaskedSingerStatusStream';
import { track } from '@/lib/mixpanel';

type ResultModalState = { type: 'success' | 'error'; message: string } | null;

const MaskedSingerPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [votedFor, setVotedFor] = useState<string | null>(getCurrentVote());
  const [voteTarget, setVoteTarget] = useState<SingerVoteItem | null>(null);
  const [resultModal, setResultModal] = useState<ResultModalState>(null);
  useMaskedSingerStatusStream();

  const {
    data: singers = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['masked-singer', 'singers'],
    queryFn: fetchSingerVoteList,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const voteMutation = useMutation({
    mutationFn: (singerId: number) => submitSingerVote(singerId),
    onSuccess: (_data, singerId) => {
      const voted = singers.find((s) => s.singerId === singerId);
      track('masked_singer_voted', { singer_id: singerId, singer_name: voted?.singerName });
      const id = String(singerId);
      setCurrentVote(id);
      setVotedFor(id);
      queryClient.invalidateQueries({ queryKey: ['masked-singer', 'singers'] });
      setResultModal({ type: 'success', message: t('maskedSinger.voteSuccess') });
    },
    onError: (error, singerId) => {
      const status = error instanceof ApiError ? error.status : undefined;
      const code = error instanceof ApiError ? error.code : undefined;
      track('masked_singer_vote_failed', {
        singer_id: singerId,
        status,
        code,
        message: error instanceof Error ? error.message : String(error),
      });
      const message =
        error instanceof ApiError && error.message
          ? error.message
          : t('maskedSinger.voteError');
      setResultModal({ type: 'error', message });
    },
  });

  const allEnded =
    singers.length > 0 && singers.every((s) => s.voteStatus === 'ENDED');
  const allResult =
    singers.length > 0 && singers.every((s) => s.voteStatus === 'RESULT');
  const showOverlay = allEnded || allResult;
  const hasVoted = votedFor !== null;
  const isVoting = voteMutation.isPending;
  const isAnyModalOpen = voteTarget !== null || resultModal !== null;

  const handleVote = (singer: SingerVoteItem) => {
    if (hasVoted || isVoting || singer.voteStatus !== 'INPROGRESS') return;
    track('masked_singer_vote_clicked', {
      singer_id: singer.singerId,
      singer_name: singer.singerName,
    });
    setVoteTarget(singer);
  };

  const handleConfirmVote = () => {
    if (!voteTarget) return;
    voteMutation.mutate(voteTarget.singerId);
    setVoteTarget(null);
  };

  useEffect(() => {
    if (!isAnyModalOpen) return;
    const handler = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      if (voteTarget) setVoteTarget(null);
      if (resultModal) setResultModal(null);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isAnyModalOpen, voteTarget, resultModal]);

  const renderVoteButton = (singer: SingerVoteItem) => {
    const id = String(singer.singerId);
    const isMine = votedFor === id;
    const isPendingForThis = isVoting && voteMutation.variables === singer.singerId;
    const disabled =
      hasVoted ||
      isVoting ||
      singer.voteStatus === 'YET' ||
      singer.voteStatus === 'ENDED' ||
      singer.voteStatus === 'RESULT';
    const label = isPendingForThis
      ? t('maskedSinger.voting')
      : isMine
        ? t('maskedSinger.voted')
        : t('maskedSinger.vote');

    const baseClass =
      'h-[38px] w-[90px] shrink-0 rounded-full border text-[14px] font-bold leading-none transition-colors';
    const stateClass = isMine
      ? 'border-[#00a63e] bg-[#00a63e] text-white'
      : disabled
        ? 'border-[#cbd5e1] bg-white/40 text-[#94a3b8] cursor-not-allowed'
        : 'border-[#00a63e] bg-white text-[#00a63e] shadow-[0_1px_3px_rgba(0,0,0,0.1)] hover:bg-[#00a63e]/5';

    return (
      <button
        type="button"
        onClick={() => handleVote(singer)}
        disabled={disabled}
        className={`${baseClass} ${stateClass}`}
      >
        {label}
      </button>
    );
  };

  return (
    <section className="flex flex-1 flex-col pb-10 text-white">
      <div className="px-6 pb-6">
        <DayHeader
          selectedDay={0}
          onSelectDay={() => {}}
          showDayTabs={false}
          title={t('maskedSinger.title')}
        />
        <p className="mt-2 text-[14px] font-light leading-snug text-white/90">
          {t('maskedSinger.subtitle')}
        </p>
      </div>

      <div className="relative mx-6 overflow-hidden rounded-[24px] border border-[#e2e8f0]/50 bg-white/70 shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)]">
        {isLoading ? (
          <p className="px-5 py-10 text-center text-[14px] text-[#45556c]">
            {t('maskedSinger.loading')}
          </p>
        ) : isError ? (
          <p className="px-5 py-10 text-center text-[14px] text-[#dc2626]">
            {t('maskedSinger.loadError')}
          </p>
        ) : singers.length === 0 ? (
          <p className="px-5 py-10 text-center text-[14px] text-[#45556c]">
            {t('maskedSinger.empty')}
          </p>
        ) : (
          <div className="flex flex-col">
            {singers.map((singer, index) => (
              <div
                key={singer.singerId}
                className={`flex items-center gap-4 px-5 py-4 ${
                  index !== singers.length - 1 ? 'border-b border-[#94a3b8]/40' : ''
                }`}
              >
                <span className="w-[28px] shrink-0 text-[24px] font-bold leading-none text-[#90a1b9]">
                  {index + 1}
                </span>
                <div className="flex min-w-0 flex-1 flex-col gap-[2px]">
                  <p className="truncate text-[16px] font-bold leading-tight text-[#1d293d]">
                    {singer.singerName}
                  </p>
                  <p className="truncate text-[13px] font-normal leading-tight text-[#45556c]">
                    {singer.songName}
                  </p>
                </div>
                {renderVoteButton(singer)}
              </div>
            ))}
          </div>
        )}

        {showOverlay && (
          <>
            <div className="pointer-events-none absolute inset-0 z-20 bg-white/62 backdrop-blur-[3px]" />
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center px-6">
              <div className="flex size-[42px] items-center justify-center rounded-full border-[2px] border-[#22c55e] bg-white">
                <FiCheck className="size-[24px] text-[#16a34a]" />
              </div>
              <p className="mt-[12px] text-center text-[16px] font-bold leading-[22px] tracking-[-0.1504px] text-[#111111]">
                {allResult ? (
                  t('maskedSinger.resultReadyLine')
                ) : (
                  <>
                    {t('maskedSinger.allEndedLine1')}
                    <br />
                    {t('maskedSinger.allEndedLine2')}
                  </>
                )}
              </p>
              {allResult && (
                <button
                  type="button"
                  onClick={() => navigate('/masked-singer/result')}
                  className="mt-[16px] h-[44px] rounded-[12px] bg-[#3b82f6] px-[28px] text-[15px] font-bold tracking-[-0.02em] text-white shadow-[0_10px_20px_rgba(59,130,246,0.35)] transition-colors hover:bg-[#2563eb]"
                >
                  {t('maskedSinger.viewResult')}
                </button>
              )}
            </div>
          </>
        )}
      </div>

      <div className="mx-6 mt-4 flex flex-col gap-4 rounded-[24px] border border-[#e2e8f0]/50 bg-white/70 px-6 py-6 shadow-[0_20px_25px_rgba(0,0,0,0.1),0_8px_10px_rgba(0,0,0,0.1)]">
        <div className="flex items-center gap-2 text-[#1d293d]">
          <FiInfo size={20} className="text-[#00a63e]" />
          <h3 className="text-[18px] font-bold leading-tight">
            {t('maskedSinger.guideTitle')}
          </h3>
        </div>

        <ul className="flex flex-col gap-2 text-[14px] leading-tight text-[#314158]">
          {[
            t('maskedSinger.guidePeriod'),
            t('maskedSinger.guideOnePerUser'),
            t('maskedSinger.guideNoChange'),
            t('maskedSinger.guideResult'),
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="mt-[2px] text-[14px] font-bold leading-tight text-[#00a63e]">
                •
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {voteTarget && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/45 px-[16px] backdrop-blur-sm onboarding-backdrop-in"
          role="presentation"
          onClick={() => {
            if (!isVoting) setVoteTarget(null);
          }}
        >
          <div
            className="relative w-full max-w-[340px] rounded-[20px] bg-white px-[20px] pb-[18px] pt-[22px] shadow-[0_24px_60px_rgba(15,23,42,0.28)] onboarding-modal-in"
            role="dialog"
            aria-modal="true"
            aria-labelledby="vote-confirm-title"
            onClick={(event) => event.stopPropagation()}
          >
            <p
              id="vote-confirm-title"
              className="text-center text-[24px] font-bold leading-none text-[#111111]"
            >
              {t('maskedSinger.confirmTitle')}
            </p>
            <p className="mt-[14px] break-keep text-center text-[15px] font-medium leading-[1.55] text-[#374151]">
              {t('maskedSinger.confirmVote', { name: voteTarget.singerName })}
            </p>
            <div className="mt-[20px] flex items-center justify-between gap-[10px]">
              <button
                type="button"
                onClick={() => setVoteTarget(null)}
                disabled={isVoting}
                className="h-[46px] flex-1 rounded-[14px] bg-[#eef2f7] text-[15px] font-semibold leading-none text-[#374151] transition-colors active:scale-[0.98] hover:bg-[#e2e8f0] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {t('common.cancel')}
              </button>
              <button
                type="button"
                onClick={handleConfirmVote}
                disabled={isVoting}
                className="h-[46px] flex-1 rounded-[14px] bg-[#00a63e] text-[15px] font-semibold leading-none text-white transition-transform active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {t('maskedSinger.vote')}
              </button>
            </div>
          </div>
        </div>
      )}

      {resultModal && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/45 px-[16px] backdrop-blur-sm onboarding-backdrop-in"
          role="presentation"
          onClick={() => setResultModal(null)}
        >
          <div
            className="relative w-full max-w-[340px] rounded-[20px] bg-white px-[20px] pb-[18px] pt-[24px] shadow-[0_24px_60px_rgba(15,23,42,0.28)] onboarding-modal-in"
            role="dialog"
            aria-modal="true"
            aria-labelledby="vote-result-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div
              className={`mx-auto flex size-[52px] items-center justify-center rounded-full ${
                resultModal.type === 'success'
                  ? 'bg-[#dcfce7] text-[#16a34a]'
                  : 'bg-[#fee2e2] text-[#dc2626]'
              }`}
            >
              {resultModal.type === 'success' ? (
                <FiCheckCircle className="size-[28px]" />
              ) : (
                <FiAlertCircle className="size-[28px]" />
              )}
            </div>
            <p
              id="vote-result-title"
              className="mt-[14px] break-keep text-center text-[16px] font-semibold leading-[1.45] text-[#111111]"
            >
              {resultModal.message}
            </p>
            <button
              type="button"
              onClick={() => setResultModal(null)}
              className="mt-[20px] h-[46px] w-full rounded-[14px] bg-[#00a63e] text-[15px] font-semibold leading-none text-white transition-transform active:scale-[0.98]"
            >
              {t('common.confirm')}
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default MaskedSingerPage;
