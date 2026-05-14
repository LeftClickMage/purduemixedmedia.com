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
  media: {
    title: 'Media',
    description: "Purdue Mixed Media's Social Media Pages. View projects created by the students, and follow for more.",
  },
  contact: {
    title: 'Contact',
    description: 'Get in touch with Officers from Purdue Mixed Media.',
  },
} as const;

// Map URL paths to page meta — used by the Cloudflare middleware.
export const pageMetaByPath: Record<string, PageMeta> = {
  '/': { title: `Purdue Mixed Media - ${pageMeta.home.title}`, description: pageMeta.home.description },
  '/events': { title: `Purdue Mixed Media - ${pageMeta.events.title}`, description: pageMeta.events.description },
  '/officers': { title: `Purdue Mixed Media - ${pageMeta.officers.title}`, description: pageMeta.officers.description },
  '/media': { title: `Purdue Mixed Media - ${pageMeta.media.title}`, description: pageMeta.media.description },
  '/contact': { title: `Purdue Mixed Media - ${pageMeta.contact.title}`, description: pageMeta.contact.description },
};

export const defaultPageMeta: PageMeta = pageMetaByPath['/'];
