import journeysData from './journeys.json';

// Member "canonical journeys" — a timeline of milestones per person, so the
// Nexus is not just links but the story of how the ZAO ecosystem was built.
// Seeded with Zaal's journey (from the RESUMEV1 timeline); others can add
// their own via PR / the "Add your journey" flow.

export interface JourneyMilestone {
  year: string;
  date?: string;
  title: string;
  summary?: string;
  category?: string;
  era?: string;
  importance?: 'core' | 'supporting' | 'optional' | string;
}

export interface Journey {
  slug: string;
  name: string;
  handle?: string;
  role?: string;
  summary?: string;
  links?: { label: string; url: string }[];
  milestones: JourneyMilestone[];
}

export const journeys: Journey[] = journeysData as Journey[];

export function getJourneyBySlug(slug: string): Journey | undefined {
  return journeys.find(j => j.slug === slug);
}
