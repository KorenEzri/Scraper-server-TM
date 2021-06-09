import {
  startBrowser,
  scrapeAll,
  getHrefs,
  generalScrape,
} from './scrape.util';
export interface Options {
  headless?: boolean;
  url?: string;
  keyword?: string;
  search_params?: string;
  withProxy?: boolean;
  proxyUrl?: string;
  return_data?: string[];
  data: {
    selector: string;
    attribute?: string;
  };
}
const switchResponse = async (
  pageInstance: any,
  selector: string,
  attribute?: string,
) => {
  switch (selector) {
    case 'a':
      const hrefRes = await getHrefs('a', pageInstance);
      return hrefRes;
    default:
      const response = await generalScrape(selector, pageInstance, attribute);
      return response;
      break;
  }
};
export const scrapeWebsite = async (options: Options) => {
  let {
    headless,
    url,
    keyword,
    search_params,
    withProxy,
    proxyUrl,
    data: { selector, attribute },
  } = options;
  if (!withProxy) withProxy = false;
  if (headless === undefined) headless = true;
  const browserInstance = await startBrowser(headless, withProxy, proxyUrl);
  const scraperObject = {
    url: url,
    async scraper(browser: { newPage: () => any }) {
      let page = await browser.newPage();
      console.log(`Navigating to ${this.url}...`);
      await page.goto(this.url, { waitUntil: 'networkidle2', timeout: 0 });
      const response = await switchResponse(page, selector, attribute);
      await page.close();
      console.log('Page closed.');
      return response;
    },
  };
  return await scrapeAll(scraperObject, browserInstance);
};
export const scrapWebsite = async (
  url: string,
  selector: string,
  attribute?: string,
) => {
  const options = {
    url: url,
    withProxy: true,
    headless: true,
    data: { selector: selector, attribute: attribute },
  };
  return await scrapeWebsite(options);
};
