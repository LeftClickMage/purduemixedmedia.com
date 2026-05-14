export interface PageMeta {
  title: string;
  description: string;
}

export const pageMeta = {
  home: {
    title: 'Home',
    description: 'Purdue Mixed Media is a student run club at Purdue University for photographers, videographers, cinematographers, and creators alike. The club is based in Indianapolis and welcomes all students!',
  },
  events: {
    title: 'Events',
    description: 'View all Purdue Mixed Media events! Including photo walks, workshops, hangougts, and more.',
  },
  officers: {
    title: 'Officers',
    description: 'Learn more about the students behind Purdue Mixed Media, view their portfolio, and more.',
  },
} as const;

// Map URL paths to page meta — used by the Cloudflare middleware.
export const pageMetaByPath: Record<string, PageMeta> = {
  '/': { title: `Purdue Mixed Media - ${pageMeta.home.title}`, description: pageMeta.home.description },
  '/events': { title: `Purdue Mixed Media - ${pageMeta.events.title}`, description: pageMeta.events.description },
  '/officers': { title: `Purdue Mixed Media - ${pageMeta.officers.title}`, description: pageMeta.officers.description },
};

export const defaultPageMeta: PageMeta = pageMetaByPath['/'];
