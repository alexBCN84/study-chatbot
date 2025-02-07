import cliProgress from "cli-progress";
import { Document } from "@langchain/core/documents";
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import * as cheerio from "cheerio";
import dotenv from "dotenv";

dotenv.config();

const MAX_URLS = parseInt(process.env.SCRAPER_MAX_URLS || "100", 10);
const BATCH_SIZE = parseInt(process.env.SCRAPER_BATCH_SIZE || "5", 10);
const MAX_DEPTH = parseInt(process.env.SCRAPER_MAX_DEPTH || "3", 10);

const progressBar = new cliProgress.SingleBar({});

async function crawlUrlsFromBase(baseUrl: string): Promise<string[]> {
  const urls = new Set<string>();

  console.log(`Crawling site: ${baseUrl}`);

  progressBar.start(MAX_URLS, 0);

  await fetchLinkedUrls(baseUrl, urls, baseUrl, 0);

  progressBar.stop();

  return [...urls];
}

async function fetchLinkedUrls(url: string, downloadedUrls: Set<string>, baseUrl: string, depth: number) {
  if (downloadedUrls.has(url) || depth > MAX_DEPTH || downloadedUrls.size >= MAX_URLS) {
    return;
  }

  progressBar.update(downloadedUrls.size);

  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);

    // Current URL is processed
    downloadedUrls.add(url);

    // Determine the base origin to restrict crawling to the same domain
    const baseOrigin = new URL(baseUrl).origin;
    const links: string[] = [];

    // Collect all anchor tag hrefs
    $("a").each((index, element) => {
      const href = $(element).attr("href");

      if (href) {
        // Resolve to absolute URL to check origin
        const absoluteLink = new URL(href, url).href;

        if (new URL(absoluteLink).origin === baseOrigin) {
          links.push(href);
        }
      }
    });

    // Process links in batches
    for (let i = 0; i < links.length; i += BATCH_SIZE) {
      const batch = links.slice(i, i + BATCH_SIZE);

      const promises = batch.map((link) => {
        const absoluteUrl = new URL(link, url).href;
        return fetchLinkedUrls(absoluteUrl, downloadedUrls, baseUrl, depth + 1);
      });

      await Promise.all(promises);
    }
  } catch (error) {
    console.error(`Error downloading HTML from ${url}: ${error}`);
  }
}

export async function loadDocuments(url: string): Promise<Document[]> { 
  const crawledUrlsFromBase = await crawlUrlsFromBase(url);

  progressBar.start(crawledUrlsFromBase.length, 0);

  const rawDocumentsPromise = crawledUrlsFromBase.map(async (url) => {
    const loader = new CheerioWebBaseLoader(url);
    const docs = await loader.load();

    progressBar.increment();

    return docs;
  });

  const rawDocuments = (await Promise.all(rawDocumentsPromise)).flat();

  progressBar.stop();

  console.log(`${rawDocuments.length} documents loaded`);

  return rawDocuments;
}
