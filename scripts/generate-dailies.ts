import { getTimezoneDate } from '../src/lib';
import makeNewDaily from '../src/lib/server/daily/make-new-daily';

const today = getTimezoneDate(new Date().getTimezoneOffset());
await makeNewDaily(today);

process.exit(0);
