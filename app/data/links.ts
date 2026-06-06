import rawLinks from './links.json';

/**
 * Link data model.
 *
 * The canonical source of truth is the flat `links.json` array (one entry per
 * link, with `category` / `subcategory` keys). It is bundled here as a fallback
 * and is ALSO fetched at runtime from raw GitHub (see `fetchLinksData`), so the
 * live site can be updated by editing `links.json` on `main` — no redeploy.
 *
 * The UI consumes the nested `MainCategory -> Subcategory -> Link[]` shape, so
 * `groupLinks()` converts flat -> nested while preserving category/subcategory
 * order.
 */

export interface Link {
  title: string;
  url: string;
  description: string;
  audience?: 'community' | 'ecosystem' | 'both';
  featured?: boolean;
  addedDate?: string;
  status?: 'live' | 'down' | 'paused';
  tags?: string[];
}

export interface Subcategory {
  subTitle: string;
  links: Link[];
}

export interface MainCategory {
  mainCategory: string;
  subcategories: Subcategory[];
}

/** Shape of a single entry in the canonical flat `links.json`. */
export interface FlatLink {
  title: string;
  url: string;
  category: string;
  subcategory?: string;
  description?: string;
  tags?: string[];
  audience?: 'community' | 'ecosystem' | 'both';
  featured?: boolean;
  addedDate?: string;
}

/** Canonical display order of the top-level categories. */
export const CATEGORY_ORDER = [
  'The ZAO',
  'ZAO OS',
  'Agents & Bots',
  'ZAO Festivals',
  'Community Projects',
  'ZAO Members',
  'Ecosystem & Tokens',
  'ZAO Onchain',
  'ZAO Stock',
] as const;

/** Raw GitHub URL of the canonical links.json on `main` (runtime sync source). */
export const RAW_LINKS_URL =
  'https://raw.githubusercontent.com/bettercallzaal/zaonexus/main/app/data/links.json';

/**
 * Convert the flat canonical list into the nested shape the UI renders.
 * Categories are emitted in CATEGORY_ORDER (unknown categories appended in
 * first-seen order); subcategories are emitted in first-seen order.
 */
export function groupLinks(flat: FlatLink[]): MainCategory[] {
  const byCategory = new Map<string, Map<string, Link[]>>();

  for (const item of flat) {
    if (!item || !item.title || !item.url || !item.category) continue;
    const category = item.category;
    const subTitle = item.subcategory || category;

    if (!byCategory.has(category)) byCategory.set(category, new Map());
    const subs = byCategory.get(category)!;
    if (!subs.has(subTitle)) subs.set(subTitle, []);

    subs.get(subTitle)!.push({
      title: item.title,
      url: item.url,
      description: item.description ?? '',
      audience: item.audience ?? 'both',
      tags: item.tags,
      featured: item.featured,
      addedDate: item.addedDate,
    });
  }

  const orderIndex = (cat: string) => {
    const i = (CATEGORY_ORDER as readonly string[]).indexOf(cat);
    return i === -1 ? Number.MAX_SAFE_INTEGER : i;
  };

  return Array.from(byCategory.entries())
    .sort((a, b) => orderIndex(a[0]) - orderIndex(b[0]))
    .map(([mainCategory, subs]) => ({
      mainCategory,
      subcategories: Array.from(subs.entries()).map(([subTitle, links]) => ({
        subTitle,
        links,
      })),
    }));
}

/** Bundled, statically-grouped data. Used for SSR and as the runtime fallback. */
export const linksData: MainCategory[] = groupLinks(rawLinks as unknown as FlatLink[]);

/**
 * Fetch the latest links from raw GitHub at runtime, grouped for the UI.
 * Falls back to the bundled `linksData` on any failure (offline, 404, parse
 * error, empty payload). Relies on GitHub's raw CDN cache (~5 min) for caching.
 */
export async function fetchLinksData(): Promise<MainCategory[]> {
  try {
    const res = await fetch(RAW_LINKS_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const flat = (await res.json()) as FlatLink[];
    if (!Array.isArray(flat) || flat.length === 0) throw new Error('empty payload');
    return groupLinks(flat);
  } catch {
    return linksData;
  }
}
