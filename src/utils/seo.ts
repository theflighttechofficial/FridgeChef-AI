import { SITE_NAME, DEFAULT_DESCRIPTION } from '../config/site';

const setMeta = (selector: string, attr: 'name' | 'property', key: string, content: string) => {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = content;
};

// Update title, description and social tags for the current view
export const setPageMeta = (title: string, description: string = DEFAULT_DESCRIPTION) => {
  const fullTitle = title === SITE_NAME ? title : `${title} | ${SITE_NAME}`;
  document.title = fullTitle;
  setMeta('meta[name="description"]', 'name', 'description', description);
  setMeta('meta[property="og:title"]', 'property', 'og:title', fullTitle);
  setMeta('meta[property="og:description"]', 'property', 'og:description', description);
  setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', fullTitle);
  setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description);
};
