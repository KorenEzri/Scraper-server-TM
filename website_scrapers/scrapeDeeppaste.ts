import { network, routes } from '../network';
import { scrapWebsite } from '../scraper';

const getPastes = async (
  pasteSiteLink: string,
  selector: string,
  attribute?: string,
) => {
  const pasteLinks = await scrapWebsite(pasteSiteLink, 'a'); //TODO change name
  return await Promise.all(
    pasteLinks.map((link: string) => {
      const scraped = scrapWebsite(link, selector, attribute);
      return scraped;
    }),
  );
};
export const scrapeDeeppaste = async () => {
  try {
    const deepPastes = await getPastes(
      'http://paste6kr6ttc5chv.onion/top.php',
      'body',
      'innerText',
    );
    await network.post(routes.onion.deeppaste, { deepPastes });
    setTimeout(async () => {
      await scrapeDeeppaste();
    }, 120000);
  } catch ({ message }) {
    console.log(message);
    setTimeout(async () => {
      await scrapeDeeppaste();
    }, 120000);
  }
};
