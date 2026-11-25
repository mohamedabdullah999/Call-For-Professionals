'use client';

import { useSyncExternalStore } from 'react';
import type { Content } from '@/content/types';
import { SITE } from '@/lib/site';

const DAY = 86_400_000;

/** Whole days until Day 1, counted in Riyadh calendar days. Static text: no ticking. */
function riyadhDayNumber(ms: number) {
  return Math.floor((ms + 3 * 3_600_000) / DAY); // Riyadh is UTC+3 all year
}

function countdownText(copy: Content['countdown'], now = Date.now()): string {
  const start = Date.parse(SITE.eventStart);
  const end = Date.parse(SITE.eventEnd);
  if (now > end) return copy.over;
  if (now >= start) return copy.live;
  const n = Math.max(1, riyadhDayNumber(start) - riyadhDayNumber(now));
  const f = copy.daysToGo;
  const template = n === 1 ? f.one : n === 2 && f.two ? f.two : n <= 10 && f.few ? f.few : f.many;
  return template.replace('{n}', String(n));
}

const noSubscribe = () => () => {};

export function Countdown({ copy, className }: { copy: Content['countdown']; className?: string }) {
  // Computed on the client only (the page is static, so the server can't know today's date)
  const text = useSyncExternalStore(
    noSubscribe,
    () => countdownText(copy),
    () => null,
  );

  return (
    <span className={className} aria-live="off">
      {text ?? ' '}
    </span>
  );
}
