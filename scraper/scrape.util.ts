import puppeteer from 'puppeteer';
export const startBrowser = async (
  headless: boolean,
  withProxy: boolean,
  proxyUrl?: string,
) => {
  let browser;
  const defaultProxyUrl = '9052';
  const runWithProxy = [
    `--proxy-server=socks5://host.docker.internal:${
      proxyUrl || defaultProxyUrl
    }`,
    '--disable-setuid-sandbox',
    '--no-sandbox',
    '--link webappnetwork:webappnetwork',
  ];
  let args: string[] = [];
  if (withProxy) args = args.concat(runWithProxy);
  try {
    console.log('Opening the browser......');
    browser = await puppeteer.launch({
      headless: headless,
      args,
      ignoreHTTPSErrors: true,
    });
  } catch (err) {
    console.log('Could not create a browser instance => : ', err);
  }
  return browser;
};
export const scrapeAll = async (
  scraperObject: { scraper: (arg0: any) => any },
  browserInstance: any,
) => {
  let browser;
  try {
    browser = await browserInstance;
    const response = await scraperObject.scraper(browser);
    return response;
  } catch (err) {
    console.log('Could not resolve the browser instance => ', err);
  }
};
export const getHrefs = async (selector: string, pageInstance: any) => {
  return await pageInstance.$$eval(selector, (as: any[]) =>
    as.map((a: { href: any }) => a.href),
  );
};
export const generalScrape = async (
  selector: string,
  pageInstance: any,
  attribute?: string,
) => {
  switch (attribute) {
    case 'textContent':
      return await pageInstance.$$eval(selector, (as: any[]) =>
        as.map(a => a.textContent),
      );
    case 'innerText':
      return await pageInstance.$$eval(selector, (as: any[]) =>
        as.map((a: any) => a.innerText),
      );
    default:
      if (attribute) {
        return await pageInstance.$$eval(selector, (as: any[]) =>
          as.map((a: any) => a.getAttribute(attribute)),
        );
      } else {
        return await pageInstance.$$eval(selector, (as: any[]) =>
          as.map((a: any) => a),
        );
      }
  }
};
