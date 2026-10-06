import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { SingerVoteItem, SingerVoteStatus } from "@/lib/api/maskedSinger";

const VOTE_STATUS_SET = new Set<SingerVoteStatus>([
  "YET",
  "INPROGRESS",
  "ENDED",
  "RESULT",
]);

const toVoteStatus = (value: unknown): SingerVoteStatus | null => {
  if (typeof value !== "string") return null;
  const normalized = value.trim().toUpperCase();
  return VOTE_STATUS_SET.has(normalized as SingerVoteStatus)
    ? (normalized as SingerVoteStatus)
    : null;
};

const parseVoteStatusFromPayload = (payload: unknown): SingerVoteStatus | null => {
  const direct = toVoteStatus(payload);
  if (direct) return direct;

  if (!payload || typeof payload !== "object") return null;

  const obj = payload as Record<string, unknown>;
  return (
    toVoteStatus(obj.status) ??
    toVoteStatus(obj.voteStatus) ??
    toVoteStatus(obj.vote_status) ??
    (obj.data ? parseVoteStatusFromPayload(obj.data) : null)
  );
};

/**
 * Subscribe to global vote status SSE and update cached singer statuses in
 * `['masked-singer','singers']`.
 */
export const useMaskedSingerStatusStream = (enabled: boolean = true) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!enabled) return;
    const apiBase = import.meta.env.VITE_API_BASE_URL;
    if (!apiBase) return;

    const baseUrl = apiBase.endsWith("/") ? apiBase.slice(0, -1) : apiBase;
    const eventSource = new EventSource(`${baseUrl}/api/votes/status/subscribe`);

    const handleStatusEvent = (event: MessageEvent<string>) => {
      const raw = event.data;
      let payload: unknown = raw;

      try {
        payload = JSON.parse(raw);
      } catch {
        payload = raw;
      }

      const nextStatus = parseVoteStatusFromPayload(payload);
      if (!nextStatus) {
        queryClient.invalidateQueries({ queryKey: ["masked-singer", "singers"] });
        return;
      }

      queryClient.setQueryData<SingerVoteItem[]>(
        ["masked-singer", "singers"],
        (previous) => {
          if (!previous) return previous;
          return previous.map((singer) => ({
            ...singer,
            voteStatus: nextStatus,
          }));
        },
      );

      if (nextStatus === "RESULT") {
        queryClient.invalidateQueries({ queryKey: ["masked-singer", "results"] });
      }
    };

    // Backend emits custom SSE events: event: voteStatus
    eventSource.addEventListener(
      "voteStatus",
      handleStatusEvent as unknown as EventListener,
    );
    // Keep default message handler as fallback for compatible payloads.
    eventSource.onmessage = (event) => {
      handleStatusEvent(event);
    };

    eventSource.onerror = (event) => {
      // EventSource handles retry internally.
      console.warn("[masked singer status SSE] connection error", event);
    };

    return () => {
      eventSource.removeEventListener(
        "voteStatus",
        handleStatusEvent as unknown as EventListener,
      );
      eventSource.close();
    };
  }, [enabled, queryClient]);
};
