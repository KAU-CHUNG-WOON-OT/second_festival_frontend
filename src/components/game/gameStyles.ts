export const GAME_CARD = 'rounded-[16px] border-2 border-ink bg-paper p-5 drop-shadow-[5px_5px_0px_var(--color-ink)]';

const BUTTON_BASE =
  'h-14 w-full rounded-full border-2 border-ink font-display text-[20px] leading-7 drop-shadow-[4px_4px_0px_var(--color-ink)] transition-transform active:translate-x-[2px] active:translate-y-[2px] disabled:opacity-40';

export const PRIMARY_BUTTON = `${BUTTON_BASE} bg-rust text-paper`;
export const SECONDARY_BUTTON = `${BUTTON_BASE} bg-paper text-ink`;
