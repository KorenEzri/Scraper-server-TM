import { scrapeDeeppaste } from './scrapeDeeppaste';
import { scrapeStronghold } from './scrapeStronghold';

// scrapeDeeppaste();

setInterval(() => {
  scrapeStronghold();
}, 150000);
