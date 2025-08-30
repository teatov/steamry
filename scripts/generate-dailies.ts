import makeNewDaily from '../src/lib/server/daily/make-new-daily';

await makeNewDaily(new Date());
process.exit(0);
