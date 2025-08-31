import { getTodayDate } from '../src/lib';
import makeNewDaily from '../src/lib/server/daily/make-new-daily';

const today = getTodayDate();
await makeNewDaily(today);

process.exit(0);
