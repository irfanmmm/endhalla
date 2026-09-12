import { useEffect, useMemo, useState } from 'react';
import {
  CALL_JOIN_WINDOW_BEFORE_MIN,
  CALL_JOIN_WINDOW_AFTER_MIN,
} from '../utils/config';

export interface JoinWindowState {
  canJoin: boolean;
  isPast: boolean;
  opensInMs: number;
  label: string;
}

function formatCountdown(ms: number): string {
  const totalMinutes = Math.max(0, Math.ceil(ms / 60000));
  if (totalMinutes < 1) return 'Starting soon';
  if (totalMinutes === 1) return 'Starts in 1 min';
  if (totalMinutes < 60) return `Starts in ${totalMinutes} min`;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `Starts in ${hours}h ${minutes}m`;
}

/**
 * Tracks whether a booking's video call is currently joinable, based on its
 * scheduledAt time. Recomputes every 15s so countdown labels stay live.
 */
export function useJoinWindow(scheduledAt?: string | null): JoinWindowState {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 15000);
    return () => clearInterval(interval);
  }, []);

  return useMemo(() => {
    if (!scheduledAt) {
      return { canJoin: false, isPast: false, opensInMs: 0, label: 'Schedule unavailable' };
    }
    const scheduledMs = new Date(scheduledAt).getTime();
    const opensAt = scheduledMs - CALL_JOIN_WINDOW_BEFORE_MIN * 60 * 1000;
    const closesAt = scheduledMs + CALL_JOIN_WINDOW_AFTER_MIN * 60 * 1000;

    if (now < opensAt) {
      return { canJoin: false, isPast: false, opensInMs: opensAt - now, label: formatCountdown(opensAt - now) };
    }
    if (now > closesAt) {
      return { canJoin: false, isPast: true, opensInMs: 0, label: 'Call ended' };
    }
    return { canJoin: true, isPast: false, opensInMs: 0, label: 'Join Call' };
  }, [scheduledAt, now]);
}
