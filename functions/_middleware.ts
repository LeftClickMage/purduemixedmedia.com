// Cloudflare Pages middleware: rewrites <title> and <meta> tags in the
// initial HTML based on the request path. This lets crawlers (Discord,
// Twitter, Google, etc.) see per-page metadata even though the app is a SPA.
//
// The metadata is imported from src/lib/pageMeta.ts so the React app and the
// middleware share one source of truth.

import { pageMetaByPath, defaultPageMeta } from '../src/lib/pageMeta';

class TitleRewriter {
  constructor(private title: string) {}
  element(element: Element) {
    element.setInnerContent(this.title);
  }
}

class MetaRewriter {
  constructor(private content: string) {}
  element(element: Element) {
    element.setAttribute('content', this.content);
  }
}

export const onRequest: PagesFunction = async (context) => {
  const response = await context.next();
  const url = new URL(context.request.url);
  const pathname = url.pathname.replace(/\/$/, '') || '/';

  // Only rewrite HTML responses
  const contentType = response.headers.get('content-type') ?? '';
  if (!contentType.includes('text/html')) return response;

  const meta = pageMetaByPath[pathname] ?? defaultPageMeta;

  return new HTMLRewriter()
    .on('title', new TitleRewriter(meta.title))
    .on('meta[name="description"]', new MetaRewriter(meta.description))
    .on('meta[property="og:title"]', new MetaRewriter(meta.title))
    .on('meta[property="og:description"]', new MetaRewriter(meta.description))
    .transform(response);
};
