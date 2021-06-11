import { network, routes } from '../network';
import { scrapWebsite } from '../scraper';
const strongholdUrls = [
  'http://nzxj65x32vh2fkhk.onion/all',
  'http://nzxj65x32vh2fkhk.onion/all?page=2',
  'http://nzxj65x32vh2fkhk.onion/all?page=3',
]; //TODO move to consts
const rules = {
  ignore: ['preview', 'Show paste', ''],
};
export const scrapeStronghold = async () => {
  try {
    await Promise.all(
      strongholdUrls.map(async (url: string) => {
        const data = await scrapWebsite(url, 'div.row', 'innerText');
        const parsed = await parseStrongholdData(data);
        await network.post(routes.onion.stronghold, parsed);
      }),
    );
    setTimeout(async () => {
      await scrapeStronghold();
    }, 120000);
  } catch ({ message }) {
    console.log(message);
    setTimeout(async () => {
      await scrapeStronghold();
    }, 120000);
  }
};
const parseStrongholdData = async (data: any) => {
  const parsed = data
    .map((paste: string) => {
      if (paste.split(' ').length > 2) {
        return parseInnerText(paste, 'Stronghold');
      }
    })
    .filter((el: string) => {
      return el != null;
    })
    .flat(1);
  return parsed;
};
const parseInnerText = (text: string, source: string) => {
  try {
    const splat = text.split('\n');
    if (splat.length < 3) return;
    const filtered = splat.filter(line => !rules.ignore.includes(line));
    const parsedData = filtered.map(() => {
      if (filtered && filtered[0])
        return {
          source: source,
          title: filtered[0],
          language: filtered[filtered.length - 1],
          posted_by: filtered[filtered.length - 2],
          body: filtered.slice(1, -2).join('\n'),
        };
    });
    const uniqueArray = parsedData.filter((thing, index) => {
      const _thing = JSON.stringify(thing);
      return (
        index ===
        parsedData.findIndex(obj => {
          return JSON.stringify(obj) === _thing;
        })
      );
    });
    return uniqueArray;
  } catch ({ message }) {
    console.log(message);
  }
};
