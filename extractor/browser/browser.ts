import { chromium, Browser, BrowserContext } from 'playwright';
import { BROWSER_TRAVERSE_SCRIPT } from '../dom/browserScript';
import { RawDomNode } from '../dom/traverse';

export interface RouteTarget {
  id: string;
  name: string;
  path: string;
  screenPrefix: number;
}

export class BrowserExtractor {
  private browser: Browser | null = null;
  private context: BrowserContext | null = null;
  private baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:5173') {
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  public async init() {
    this.browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--font-render-hinting=none']
    });

    this.context = await this.browser.newContext({
      viewport: { width: 1440, height: 1024 },
      deviceScaleFactor: 1
    });
  }

  public async extractScreen(route: RouteTarget): Promise<{
    id: string;
    name: string;
    rootRaw: RawDomNode;
    refUrl: string;
  }> {
    if (!this.context) {
      throw new Error('BrowserExtractor is not initialized. Call init() first.');
    }

    const page = await this.context.newPage();
    const fullUrl = `${this.baseUrl}${route.path}`;

    try {
      console.log(`[BrowserExtractor] Navigating to ${fullUrl}...`);
      await page.goto(fullUrl, { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForSelector('.app-shell', { timeout: 10000 });
      // Short delay for fonts and transitions
      await page.waitForTimeout(500);

      // Execute in-browser DOM traversal
      const rawTree = await page.evaluate(({ scriptStr, prefix }) => {
        const fn = eval(scriptStr);
        return fn(prefix);
      }, { scriptStr: BROWSER_TRAVERSE_SCRIPT, prefix: route.screenPrefix });

      return {
        id: route.id,
        name: route.name,
        rootRaw: rawTree,
        refUrl: fullUrl
      };
    } finally {
      await page.close();
    }
  }

  public async close() {
    if (this.context) {
      await this.context.close();
      this.context = null;
    }
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}
