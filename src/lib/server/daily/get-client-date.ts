import type { ServerLoadEvent } from '@sveltejs/kit';
import { getTimezoneDate, getTodayDate, TZ_COOKIE } from '$lib';

export default function getClientDate(cookies: ServerLoadEvent['cookies']) {
  let date = getTodayDate();

  const timezone =
    cookies.get(TZ_COOKIE) !== undefined && !Number.isNaN(Number(cookies.get(TZ_COOKIE)))
      ? Number(cookies.get(TZ_COOKIE))
      : null;
  if (timezone !== null && timezone >= -14 * 60 && timezone <= 12 * 60) {
    date = getTimezoneDate(Number(cookies.get(TZ_COOKIE)));
  }

  return date;
}
