import { getTodayDate } from '../src/lib';
import makeNewDaily from '../src/lib/server/daily/make-new-daily';

await makeNewDaily(getTodayDate());
process.exit(0);
