import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { TicketCounterResponse } from "@/lib/api/ticket";

/**
 * Subscribe to the ticket counter SSE stream and feed updates into the
 * `['ticket', 'counter']` query cache so any consumer of `useQuery` for the
 * same key sees real-time values.
 *
 * Backend emits plain integer strings (e.g. `data: 90`) only on change, so we
 * parse with `Number()` and ignore non-numeric payloads. EventSource handles
 * automatic reconnection on transient network errors.
 */
export const useTicketCounterStream = (enabled: boolean = true) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!enabled) return;
    const apiBase = import.meta.env.VITE_API_BASE_URL;
    if (!apiBase) return;

    const baseUrl = apiBase.endsWith("/") ? apiBase.slice(0, -1) : apiBase;
    const eventSource = new EventSource(`${baseUrl}/ticket/counter/stream`);

    eventSource.onmessage = (event) => {
      const count = Number(event.data);
      if (!Number.isFinite(count)) return;
      queryClient.setQueryData<TicketCounterResponse>(
        ["ticket", "counter"],
        { current_count: count },
      );
    };

    eventSource.onerror = (event) => {
      // EventSource auto-reconnects with backoff; just log for diagnostics.
      console.warn("[ticket counter SSE] connection error", event);
    };

    return () => {
      eventSource.close();
    };
  }, [enabled, queryClient]);
};
