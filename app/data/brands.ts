export type BrandStage = 'active' | 'incubating' | 'zabal-track' | 'graduated' | 'paused';
export type BrandTier = 'umbrella' | 'organization' | 'project' | 'sub-brand';
export type Chain = 'base' | 'optimism' | 'mainnet' | 'solana';

export interface Link {
  title: string;
  url: string;
  description: string;
  category?: string;
}

export interface Milestone {
  date: string;
  title: string;
  description?: string;
  url?: string;
}

export interface TokenContract {
  chain: 'base' | 'optimism' | 'mainnet';
  address: string;
  symbol: string;
}

export interface FarcasterInfo {
  handle?: string;
  channel?: string;
  fid?: number;
}

export interface LiveData {
  farcasterCastCount?: number;
  farcasterLastCast?: { hash: string; text: string; timestamp: string };
  githubLastCommit?: { sha: string; message: string; date: string };
  tokenHolderCount?: number;
}

export interface Brand {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  stage: BrandStage;
  tier: BrandTier;
  parent?: string;
  status: 'live' | 'down' | 'paused' | 'unknown';
  founders?: string[];
  cofounders?: string[];
  staff?: string[];
  founded?: string;

  // primary surfaces
  homepage?: string;
  github?: string;
  farcaster?: FarcasterInfo;
  x?: string;
  instagram?: string;
  telegram?: string;
  email?: string;

  // extended
  tokenContract?: TokenContract;
  chain?: Chain;          // primary chain when not captured by tokenContract
  hatsTreeId?: string;    // Hats Protocol tree id (Respect Game role tree)
  links: Link[];
  milestones?: Milestone[];
  featured?: boolean;

  // live-data targets (filled at request time)
  liveData?: LiveData;
}

export const brands: Brand[] = [
  // Umbrella & Core Organization
  {
    slug: 'bettercallzaal',
    name: 'BetterCallZaal',
    tagline: 'Founder-first business and creative services',
    description: 'BCZ Strategies LLC is the legal hub and umbrella for all ZABAL projects. Zaal\'s solo founder track incubating community ideas into The ZAO. Home for Empire Builder, Bonfire integration, POIDH bounties, and cross-project tooling.',
    stage: 'active',
    tier: 'umbrella',
    status: 'live',
    founded: 'Jan 2024 (The ZAO structure)',
    homepage: 'https://bettercallzaal.com',
    x: 'bettercallzaal',
    farcaster: { handle: 'bettercallzaal' },
    github: 'https://github.com/bettercallzaal',
    links: [
      {
        title: 'Website',
        url: 'https://bettercallzaal.com',
        description: 'Official BCZ website'
      },
      {
        title: 'Nexus Portal',
        url: 'https://bettercallzaal.com/nexus.html',
        description: 'All links and surfaces across the ZABAL ecosystem'
      },
      {
        title: 'X Profile',
        url: 'https://x.com/bettercallzaal',
        description: 'Follow for updates'
      }
    ]
  },

  {
    slug: 'the-zao',
    name: 'The ZAO',
    tagline: 'Decentralized impact network for digital creators',
    description: 'A collective impact network that operates as an incubator for community-driven projects. Founded by Zaal to help digital creators build their brand and scale. The ZAO is the hub where artists, developers, and builders collaborate to ship projects.',
    stage: 'active',
    tier: 'organization',
    status: 'live',
    founders: ['Zaal'],
    // Note: Webflow source lists candytoybox, attabotty, HURRIC4N3IKE, Jango UU as "ZAO Co-Founders".
    // Per doc 621 (2026-05-07), Zaal is the solo founder of The ZAO.
    // Community members are cofounders of specific ZAO PROJECTS, not of The ZAO itself.
    // This field preserved for historical/aspirational context from Webflow.
    cofounders: ['candytoybox', 'attabotty', 'HURRIC4N3IKE', 'Jango UU'],
    staff: ['EZinCrypto'],
    founded: 'Jan 2024',
    homepage: 'https://thezao.com',
    x: 'thezao',
    farcaster: { handle: 'thezao', channel: 'zao', fid: 19640 },
    github: 'https://github.com/bettercallzaal/ZAOOS',
    links: [
      {
        title: 'Website',
        url: 'https://thezao.com',
        description: 'Official ZAO hub'
      },
      {
        title: 'ZAOOS Monorepo',
        url: 'https://github.com/bettercallzaal/ZAOOS',
        description: 'Main codebase and research library'
      },
      {
        title: 'Fractal Process',
        url: 'https://thezao.com/fractals',
        description: 'Weekly community governance Mondays 6pm EST'
      }
    ]
  },

  // ZAO Projects (Incubated)
  {
    slug: 'zao-festivals',
    name: 'ZAO Festivals',
    tagline: 'IRL and digital music events bringing the community together',
    description: 'The live events arm of The ZAO. Produces flagship festivals connecting artists, fans, and builders in person. Umbrella for ZAOstock (Oct 3 2026) and music releases like Cipher.',
    stage: 'active',
    tier: 'project',
    parent: 'the-zao',
    status: 'live',
    founders: ['Zaal', 'attabotty'],
    founded: 'June 2024',
    homepage: 'https://zaofestivals.com',
    x: 'zaofestivals',
    instagram: 'zaofestivals',
    farcaster: { handle: 'zaofestivals' },
    links: [
      {
        title: 'Website',
        url: 'https://zaofestivals.com',
        description: 'Official ZAO Festivals site'
      },
      {
        title: 'Instagram',
        url: 'https://instagram.com/zaofestivals',
        description: 'Follow for festival updates'
      },
      {
        title: 'X / Twitter',
        url: 'https://x.com/zaofestivals',
        description: 'Follow @zaofestivals'
      },
      {
        title: 'Facebook',
        url: 'https://www.facebook.com/zaofestivals',
        description: 'Follow on Facebook'
      },
      {
        title: 'LinkedIn',
        url: 'https://www.linkedin.com/company/zaofestivals',
        description: 'Follow on LinkedIn'
      },
      {
        title: 'YouTube',
        url: 'https://www.youtube.com/c/zaofestivals',
        description: 'Watch on YouTube'
      },
      {
        title: 'Merch Shop',
        url: 'https://merch.zaofestivals.com',
        description: 'ZAO Festivals merchandise'
      }
    ]
  },

  {
    slug: 'zaostock',
    name: 'ZAOstock 2026',
    tagline: 'Flagship Oct 3 festival celebrating independent artists',
    description: 'The primary ZAO Festivals event. Oct 3 2026, Franklin St Parklet, Ellsworth. Celebrating independent artists with performances, art installations, and community connection.',
    stage: 'incubating',
    tier: 'sub-brand',
    parent: 'zao-festivals',
    status: 'live',
    founded: 'April 2026',
    homepage: 'https://zaofestivals.com/zaostock',
    farcaster: { channel: 'zaostock' },
    links: [
      {
        title: 'ZAOstock on ZAO Festivals',
        url: 'https://zaofestivals.com/zaostock',
        description: 'Festival details'
      },
      {
        title: 'Team Bot (Telegram)',
        url: 'https://t.me/ZAOstockTeamBot',
        description: 'Coordinate with the team'
      }
    ]
  },

  {
    slug: 'cipher',
    name: 'Cipher',
    tagline: 'First music release from ZAO Festivals',
    description: 'The inaugural music release from the ZAO Festivals program. Showcasing original tracks from ZAO community artists.',
    stage: 'incubating',
    tier: 'sub-brand',
    parent: 'zao-festivals',
    status: 'live',
    founded: '2026',
    links: [
      {
        title: 'Coming Soon',
        url: 'https://zaofestivals.com',
        description: 'More details on Cipher coming soon'
      }
    ]
  },

  {
    slug: 'wavewarz',
    name: 'WaveWarZ',
    tagline: 'Web3 music production and prediction platform',
    description: 'First ZAO incubated project. A decentralized music production and prediction platform where artists create, remix, and collaborate on-chain. Production runs on Solana with an agentic port on Base. Built by Hurric4n3ike with Zaal and Samantha (candytoybox) as cofounders.',
    stage: 'active',
    tier: 'project',
    parent: 'the-zao',
    status: 'live',
    founders: ['Hurric4n3ike', 'Zaal', 'Samantha (candytoybox)'],
    founded: '2024',
    chain: 'solana',
    homepage: 'https://wavewarz.com',
    github: 'https://github.com/CandyToyBox',
    x: 'WaveWarZ',
    farcaster: { channel: 'wavewarz' },
    links: [
      {
        title: 'Main site',
        url: 'https://wavewarz.com',
        description: 'Music prediction market (Solana production, Base agentic port)'
      },
      {
        title: 'Intelligence dashboard',
        url: 'https://wavewarz-intelligence.vercel.app',
        description: 'Analytics dashboard'
      },
      {
        title: 'GitHub (CandyToyBox org)',
        url: 'https://github.com/CandyToyBox',
        description: 'wavewarz-base, wavewarz-intelligence, wavewarz-merch-shop repos'
      }
    ]
  },

  {
    slug: 'wavewarz-africa',
    name: 'WaveWarZ Africa',
    tagline: 'Expanding music creation to African communities',
    description: 'WaveWarZ\'s Africa initiative led by Iman. Bringing music production tools and community to creators across the African continent.',
    stage: 'active',
    tier: 'sub-brand',
    parent: 'wavewarz',
    status: 'live',
    founders: ['Iman'],
    links: [
      {
        title: 'WaveWarZ',
        url: 'https://wavewarz.io',
        description: 'Learn more on main site'
      }
    ]
  },

  {
    slug: 'zao-fractals',
    name: 'ZAO Fractals',
    tagline: 'Weekly community governance and alignment meetings',
    description: 'Recurring Monday 6pm EST governance meetings. Both a decision-making structure AND a project deliverable. Community members discuss priorities, allocate resources, and align on strategy.',
    stage: 'active',
    tier: 'project',
    parent: 'the-zao',
    status: 'live',
    founded: 'June 3 2024',
    links: [
      {
        title: 'Fractal Info',
        url: 'https://thezao.com/fractals',
        description: 'Join the Fractals'
      }
    ]
  },

  {
    slug: 'zabal-newsletter',
    name: 'ZABAL Newsletter',
    tagline: 'Daily updates from the founder',
    description: 'The official newsletter covering ZABAL ecosystem updates. Published daily via ZOE concierge bot. Curated insights on projects, community, and the vision.',
    stage: 'active',
    tier: 'project',
    parent: 'the-zao',
    status: 'live',
    founded: '2026',
    links: [
      {
        title: 'Subscribe',
        url: 'https://paragraph.com/@thezao',
        description: 'Get daily updates'
      }
    ]
  },

  {
    slug: 'zao-devz',
    name: 'ZAO Devz',
    tagline: 'Community of developers building in the ZAO ecosystem',
    description: 'Developer community led by Iman. Dispatch, collaboration, and hourly learning tips. Features the @zaodevz_bot Telegram bot for group coordination.',
    stage: 'active',
    tier: 'project',
    parent: 'the-zao',
    status: 'live',
    founders: ['Iman'],
    telegram: 'zaodevz_bot',
    farcaster: { handle: 'zaodevz_bot' },
    links: [
      {
        title: 'Telegram Bot',
        url: 'https://t.me/zaodevz_bot',
        description: 'Join the dev community'
      }
    ]
  },

  {
    slug: 'web3-podcast',
    name: 'Web3 Podcast',
    tagline: 'Deep dives into the future of web3 and music',
    description: 'A ZAO project podcast exploring web3, music, and technology. Hosted by Zaal with Ohnahji B.',
    stage: 'active',
    tier: 'project',
    parent: 'the-zao',
    status: 'live',
    founders: ['Zaal', 'Ohnahji B'],
    links: [
      {
        title: 'Episodes',
        url: 'https://zaofestivals.com',
        description: 'Find all episodes on ZAO Festivals'
      }
    ]
  },

  // ZAO OS (Substrate)
  {
    slug: 'zao-os',
    name: 'ZAO OS',
    tagline: 'Operating system for the decentralized music community',
    description: 'The lab and substrate where ZAO projects are built. Monorepo containing the Farcaster client, agent stack (ZOE, Hermes), research library, and infrastructure for The ZAO ecosystem.',
    stage: 'active',
    tier: 'project',
    parent: 'the-zao',
    status: 'live',
    founded: 'Jan 2024',
    homepage: 'https://zaoos.com',
    github: 'https://github.com/bettercallzaal/ZAOOS',
    x: 'zaoos',
    links: [
      {
        title: 'App',
        url: 'https://zaoos.com',
        description: 'Main ZAO OS application'
      },
      {
        title: 'Repository',
        url: 'https://github.com/bettercallzaal/ZAOOS',
        description: '301 routes, 279 components, 540+ research docs'
      }
    ]
  },

  {
    slug: 'zoe',
    name: 'ZOE',
    tagline: 'Concierge agent for The ZAO',
    description: 'Single autonomous concierge bot handling tasks, captures, briefs, reflection, and recall. Lives in ZAO OS. Available as @zaoclaw_bot on Telegram.',
    stage: 'active',
    tier: 'project',
    parent: 'zao-os',
    status: 'live',
    telegram: 'zaoclaw_bot',
    farcaster: { handle: 'zaoclaw_bot' },
    links: [
      {
        title: 'Chat Interface',
        url: 'https://chat.zaoos.com',
        description: 'Talk to ZOE'
      },
      {
        title: 'Telegram',
        url: 'https://t.me/zaoclaw_bot',
        description: '@zaoclaw_bot'
      }
    ]
  },

  {
    slug: 'hermes',
    name: 'Hermes',
    tagline: 'Autonomous fix-PR pipeline for code quality',
    description: 'Autonomous agent that handles code reviews, fixes, and pull request creation. Part of the ZAO agent stack. Available as @zoe_hermes_bot on Telegram.',
    stage: 'active',
    tier: 'project',
    parent: 'zao-os',
    status: 'live',
    telegram: 'zoe_hermes_bot',
    links: [
      {
        title: 'GitHub Integration',
        url: 'https://github.com/bettercallzaal/ZAOOS',
        description: 'Integrated in ZAOOS repo'
      }
    ]
  },

  // Graduated & Independent
  {
    slug: 'coc-concertz',
    name: 'COC Concertz',
    tagline: 'Live music streaming and concert platform',
    description: 'Graduated from The ZAO into its own brand. Livestreaming team also handles ZAO Festivals production. Independent brand with operational overlap.',
    stage: 'graduated',
    tier: 'project',
    status: 'live',
    founded: '2024',
    homepage: 'https://cocconcertz.com',
    x: 'cocconcertz',
    instagram: 'cocconcertz',
    links: [
      {
        title: 'Website',
        url: 'https://cocconcertz.com',
        description: 'Stream live concerts'
      }
    ]
  },

  // ZABAL Track Projects
  {
    slug: 'empire-builder',
    name: 'Empire Builder',
    tagline: 'Token launch and creator-economy primitives',
    description: 'ZABAL track project. Token launch + ecosystem primitive. Featured at two crypto conferences. Being integrated into ZAO OS. Used live in ZABAL Gamez S1 (Jun 1 2026) to spin up a tokenless ZABAL Gamez Empire. Pending formal proposal to become a ZAO Project.',
    stage: 'zabal-track',
    tier: 'project',
    parent: 'bettercallzaal',
    status: 'live',
    links: [
      {
        title: 'Learn More',
        url: 'https://bettercallzaal.com',
        description: 'Check out BCZ site for details'
      },
      {
        title: 'ZABAL Gamez Empire (live)',
        url: 'https://empirebuilder.world/empire/zabalgamez01e9af',
        description: 'Tokenless ZABAL Gamez Empire created live on Day 1'
      }
    ]
  },

  {
    slug: 'bonfire',
    name: 'Bonfire Integration',
    tagline: 'Community knowledge graph and recall system',
    description: 'ZABAL track. Personal and community knowledge graph at bonfires.ai. Integrated into ZOE via Hermes-brain pattern. Auto-push pipeline for knowledge capture.',
    stage: 'zabal-track',
    tier: 'project',
    parent: 'bettercallzaal',
    status: 'live',
    // Team note: Joshua.eth (Josh) is the FOUNDER. Ryan ("Rskagy") is a SEPARATE
    // person who authors the Bonfires SDK — do NOT conflate Josh and Ryan.
    // Plat0x = Carlos (technical architect). Jen Tran = business strategy (UNCONFIRMED).
    founders: ['Joshua.eth (Josh)'],
    staff: [
      'Plat0x / Carlos (technical architect)',
      'Ryan / Rskagy (Bonfires SDK author)',
      'Jen Tran (business strategy — unconfirmed)'
    ],
    homepage: 'https://bonfires.ai',
    links: [
      {
        title: 'Bonfires',
        url: 'https://bonfires.ai',
        description: 'Access the knowledge graph'
      }
    ]
  },

  {
    slug: 'poidh',
    name: 'POIDH Bounties',
    tagline: 'Community bounty system for creators',
    description: 'ZABAL track. Community bounty platform. First ZAO POIDH clip-up bounty live 2026-04-27 at poidh.xyz/base/bounty/1151.',
    stage: 'zabal-track',
    tier: 'project',
    parent: 'bettercallzaal',
    status: 'live',
    homepage: 'https://poidh.xyz',
    links: [
      {
        title: 'POIDH Platform',
        url: 'https://poidh.xyz',
        description: 'Explore bounties'
      },
      {
        title: 'First ZAO Bounty',
        url: 'https://poidh.xyz/base/bounty/1151',
        description: 'Clip-up bounty - Deadline May 4'
      }
    ]
  },

  {
    slug: 'bcz-yapz',
    name: 'BCZ YapZ',
    tagline: 'Decentralized social identity and reputation',
    description: 'ZABAL track. Graduated from ZAOOS to own repo and domain May 2026. Social identity and reputation system. Available at bczyapz.com.',
    stage: 'zabal-track',
    tier: 'project',
    parent: 'bettercallzaal',
    status: 'live',
    founded: '2024',
    homepage: 'https://bczyapz.com',
    github: 'https://github.com/bettercallzaal/bcz-yapz',
    links: [
      {
        title: 'BCZ YapZ',
        url: 'https://bczyapz.com',
        description: 'Social identity platform'
      },
      {
        title: 'Repository',
        url: 'https://github.com/bettercallzaal/bcz-yapz',
        description: 'Open source code'
      }
    ]
  },

  // Paused
  {
    slug: 'fishbowlz',
    name: 'FISHBOWLZ',
    tagline: 'Audio rooms platform (paused)',
    description: 'PAUSED 2026-04-16. Pivoted to partnership with Juke. Was an audio rooms platform at fishbowlz.xyz.',
    stage: 'paused',
    tier: 'project',
    status: 'paused',
    founded: '2024',
    homepage: 'https://fishbowlz.xyz',
    links: [
      {
        title: 'Historical Site',
        url: 'https://fishbowlz.xyz',
        description: 'Archived (paused)'
      },
      {
        title: 'Rooms',
        url: 'https://fishbowlz.xyz/rooms/',
        description: 'Browse FISHBOWLZ rooms (archived)'
      }
    ]
  },

  // Artist Sub-brands
  {
    slug: 'tom-fellenz',
    name: 'Tom Fellenz',
    tagline: 'Experimental electronic music producer',
    description: 'Artist and collaborator within The ZAO ecosystem.',
    stage: 'active',
    tier: 'sub-brand',
    parent: 'the-zao',
    status: 'live',
    x: 'tomfellenz',
    links: [
      {
        title: 'X Profile',
        url: 'https://x.com/tomfellenz',
        description: 'Follow for updates'
      }
    ]
  },

  {
    slug: 'stilo-world',
    name: 'Stilo World',
    tagline: 'Creative visual and audio experience',
    description: 'Artist and creator within The ZAO community.',
    stage: 'active',
    tier: 'sub-brand',
    parent: 'the-zao',
    status: 'live',
    links: [
      {
        title: 'Website',
        url: 'https://stiloworld.com',
        description: 'Explore the world'
      }
    ]
  },

  {
    slug: 'joseph-goats',
    name: 'Joseph Goats',
    tagline: 'Music producer and community builder',
    description: 'Artist and collaborator. Formerly known as Jose Goats, now Joseph Goats.',
    stage: 'active',
    tier: 'sub-brand',
    parent: 'the-zao',
    status: 'live',
    links: [
      {
        title: 'SoundCloud',
        url: 'https://soundcloud.com/luijoseph',
        description: 'Music platform'
      },
      {
        title: 'Farcaster',
        url: 'https://farcaster.xyz/~/user/josephgoats',
        description: 'Connect on Farcaster'
      }
    ]
  },

  {
    slug: 'jangouu-forever',
    name: 'JANGOUU FOREVER',
    tagline: 'Origin figure in Zaal\'s indie artist journey',
    description: 'Foundational musician relationship from college 2018/2019. The collaboration that triggered Zaal\'s entrepreneurial thinking about supporting independent artists. Semi-active in ZAO orbit.',
    stage: 'active',
    tier: 'sub-brand',
    parent: 'the-zao',
    status: 'live',
    founded: '2018',
    x: 'jangouuforever',
    instagram: 'jangouuforever',
    links: [
      {
        title: 'X Profile',
        url: 'https://x.com/jangouuforever',
        description: 'Follow @jangouuforever'
      },
      {
        title: 'Instagram',
        url: 'https://instagram.com/jangouuforever',
        description: 'Follow @jangouuforever'
      },
      {
        title: 'Spotify',
        url: 'https://open.spotify.com/artist/5nc2dgefoPLfvsrJVx3PNz',
        description: 'Listen on Spotify'
      },
      {
        title: 'Beacons.ai',
        url: 'https://beacons.ai/jango.uu',
        description: 'Link hub'
      }
    ]
  },

  {
    slug: 'ritzy-periwinkle',
    name: 'Ritzy Periwinkle',
    tagline: 'Creative artist and collaborator',
    description: 'Artist and creator within The ZAO ecosystem.',
    stage: 'active',
    tier: 'sub-brand',
    parent: 'the-zao',
    status: 'live',
    homepage: 'https://www.ritzyperiwinkle.com',
    x: 'ritzy_p',
    instagram: 'ritzyp',
    links: [
      { title: 'Website', url: 'https://www.ritzyperiwinkle.com', description: 'Personal site' },
      { title: 'X / Twitter', url: 'https://x.com/ritzy_p', description: 'Follow on X' },
      { title: 'Instagram', url: 'https://instagram.com/ritzyp', description: 'Follow on Instagram' },
      { title: 'LinkedIn', url: 'https://linkedin.com/in/ritzyp', description: 'Professional profile' }
    ]
  },

  {
    slug: 'ohnahji-b',
    name: 'Ohnahji B',
    tagline: 'Audio and web3 creator',
    description: 'Artist and collaborator in The ZAO ecosystem. Co-host of the Web3 Podcast with Zaal.',
    stage: 'active',
    tier: 'sub-brand',
    parent: 'the-zao',
    status: 'live',
    links: [
      {
        title: 'Linktree',
        url: 'https://linktr.ee/ohnahji',
        description: 'All Ohnahji B links'
      }
    ]
  },

  {
    slug: 'midipunkz',
    name: 'MidiPunkZ',
    tagline: 'On-chain music production and community platform',
    description: 'Community and collaboration partner within The ZAO ecosystem. Platform for music creation, gaming, and collectible avatars. Collaborates with ZAO on music tracks and community spaces.',
    stage: 'active',
    tier: 'sub-brand',
    parent: 'the-zao',
    status: 'live',
    founded: '2023',
    homepage: 'https://midipunkz.com',
    links: [
      {
        title: 'Website',
        url: 'https://midipunkz.com',
        description: 'Main MidiPunkZ platform'
      },
      {
        title: 'MidiVaderz Game',
        url: 'https://midipunkz.com/games',
        description: 'Play MidiVaderz'
      },
      {
        title: 'MidiPunkz Community',
        url: 'https://ima.midipunkz.com/communities/midipunkz',
        description: 'Community hub'
      },
      {
        title: 'FeatherFrogs Community',
        url: 'https://ima.midipunkz.com/communities/featherfrogs',
        description: 'FeatherFrogs community'
      },
      {
        title: 'MidiEzz Avatars',
        url: 'https://midipunkz.com/midiezz',
        description: 'Collectible avatars'
      },
      {
        title: 'ZAO Community Page',
        url: 'https://ima.midipunkz.com/communities/the-zao',
        description: 'ZAO on MidiPunkZ'
      }
    ]
  },

  {
    slug: 'godcloud',
    name: 'GodCloud',
    tagline: 'Web3 artist and musician in The ZAO',
    description: 'ZAO community musician and artist. Active contributor to The ZAO ecosystem.',
    stage: 'active',
    tier: 'sub-brand',
    parent: 'the-zao',
    status: 'live',
    homepage: 'https://godcloud.org',
    links: [
      {
        title: 'Website',
        url: 'https://godcloud.org',
        description: 'GodCloud main site'
      },
      {
        title: 'Drip.haus',
        url: 'https://drip.haus/godcloud',
        description: 'Support GodCloud on Drip'
      }
    ]
  },

  {
    slug: 'jed-xo',
    name: 'Jed XO',
    tagline: 'Creator and community member',
    description: 'Community member within The ZAO ecosystem. No public brand surface yet.',
    stage: 'paused',
    tier: 'sub-brand',
    parent: 'the-zao',
    status: 'paused', // was 'unknown' — reconciled to a dormant placeholder
    links: [] // intentionally empty — no canonical links yet
  },

  {
    slug: 'defi-space-donkeys',
    name: 'Defi Space Donkeys',
    tagline: 'Community project (coming soon)',
    description: 'Upcoming project within The ZAO ecosystem. Details coming soon.',
    stage: 'paused', // reconciled: was stage:incubating + status:paused (contradiction)
    tier: 'sub-brand',
    parent: 'the-zao',
    status: 'paused',
    links: [] // intentionally empty — "coming soon", no surface yet
  },

  {
    slug: 'impact-concerts',
    name: 'Impact Concerts',
    tagline: 'Community project (coming soon)',
    description: 'Upcoming concert initiative within The ZAO ecosystem. Details coming soon.',
    stage: 'paused', // reconciled: was stage:incubating + status:paused (contradiction)
    tier: 'sub-brand',
    parent: 'the-zao',
    status: 'paused',
    links: [] // intentionally empty — "coming soon", no surface yet
  },

  {
    slug: 'ez-in-crypto',
    name: 'EZinCrypto',
    tagline: 'ZAO staff member and contributor',
    description: 'ZAO ecosystem contributor and staff member. Part of the core team supporting The ZAO.',
    stage: 'active',
    tier: 'sub-brand',
    parent: 'the-zao',
    status: 'live',
    links: [] // intentionally empty — staff contributor, no dedicated brand surface
  },

  // Other Ecosystems & Tools (if any should be tracked)
  {
    slug: 'zabal-token',
    name: 'ZABAL Token',
    tagline: 'Native ecosystem token',
    description: 'The ZABAL token. ERC-20 on Base representing ecosystem participation and value.',
    stage: 'active',
    tier: 'project',
    status: 'live',
    chain: 'base',
    tokenContract: {
      chain: 'base',
      address: '0xbB48f19B0494Ff7C1fE5Dc2032aeEE14312f0b07',
      symbol: 'ZABAL'
    },
    links: [
      {
        title: 'ZABAL on Empire Builder',
        url: 'https://empirebuilder.world/profile/0x7234c36A71ec237c2Ae7698e8916e0735001E9Af',
        description: 'Empire V3 profile for ZABAL'
      },
      {
        title: 'Empire Leaderboard API',
        url: 'https://empirebuilder.world/api/leaderboards?tokenAddress=0xbB48f19B0494Ff7C1fE5Dc2032aeEE14312f0b07',
        description: 'Live leaderboard JSON for ZABAL holders'
      },
      {
        title: 'Magnetiq Zabal Connector (zabal.lol)',
        url: 'https://app.magnetiq.xyz/brand/ZABAL/magnet/Zabal%20Connector',
        description: 'ZABAL x Magnetiq partnership magnet. Vanity URL: zabal.lol'
      },
      {
        title: 'Bonfires KG for ZABAL',
        url: 'https://graph.bonfires.ai/zabal',
        description: 'ZABAL knowledge-graph view'
      },
      {
        title: 'Incented org',
        url: 'https://incented.co/organizations/zabal',
        description: 'ZABAL on Incented'
      },
      {
        title: 'SongJam ZABAL hub',
        url: 'https://songjam.space/zabal',
        description: 'ZABAL track on SongJam'
      }
    ]
  },

  {
    slug: 'magnetiq',
    name: 'Magnetiq',
    tagline: 'Brand-magnet platform partnered with ZABAL',
    description: 'Magnetiq powers the ZABAL Connector magnet at zabal.lol -> app.magnetiq.xyz/brand/ZABAL. Partnership for ecosystem activation flows.',
    stage: 'active',
    tier: 'sub-brand',
    parent: 'bettercallzaal',
    status: 'live',
    homepage: 'https://app.magnetiq.xyz/brand/ZABAL/magnet/Zabal%20Connector',
    links: [
      {
        title: 'ZABAL Connector (zabal.lol)',
        url: 'https://app.magnetiq.xyz/brand/ZABAL/magnet/Zabal%20Connector',
        description: 'Vanity: zabal.lol -> ZABAL magnet on Magnetiq'
      }
    ]
  },

  {
    slug: 'iykyk',
    name: 'iykyk',
    tagline: 'Partner brand on blank.space',
    description: 'iykyk - partner brand within The ZAO ecosystem. Hosted on blank.space creator infrastructure.',
    stage: 'active',
    tier: 'sub-brand',
    parent: 'the-zao',
    status: 'live',
    homepage: 'https://iykyk.blank.space/home/Explore',
    links: [
      {
        title: 'iykyk Explore',
        url: 'https://iykyk.blank.space/home/Explore',
        description: 'iykyk home on blank.space'
      }
    ]
  },

  // Events & Governance
  {
    slug: 'zabal-gamez',
    name: 'ZABAL Gamez',
    tagline: 'Season 1 — 3-month community buildathon',
    description: 'ZABAL Gamez Season 1 is live: a 3-month buildathon running daily workshops. Day 1 (Jun 1 2026) shipped two workshops — yerbearserker on Empire Builder (a tokenless ZABAL Gamez Empire was created live) and Joshua.eth + Plat0x on Bonfire. Day 2 (Jun 2 2026) Ohnahji on livestreaming.',
    stage: 'active',
    tier: 'project',
    parent: 'bettercallzaal',
    status: 'live',
    founded: 'Jun 1 2026',
    links: [
      {
        title: 'ZABAL Gamez Empire',
        url: 'https://empirebuilder.world/empire/zabalgamez01e9af',
        description: 'Tokenless Empire created live on Day 1'
      }
    ],
    milestones: [
      { date: '2026-06-01', title: 'S1 Day 1', description: 'yerbearserker / Empire Builder (tokenless ZABAL Gamez Empire created live) + Joshua.eth & Plat0x on Bonfire' },
      { date: '2026-06-02', title: 'S1 Day 2', description: 'Ohnahji on livestreaming' }
    ]
  },

  {
    slug: 'respect-game',
    name: 'Respect Game (ZAO Hats Tree)',
    tagline: 'On-chain role/respect tree for ZAO governance',
    description: 'The ZAO governance role tree built on Hats Protocol (the "Respect Game"). Lives on Optimism as tree id 226. Surfaces the org structure at hats.thezao.com.',
    stage: 'active',
    tier: 'project',
    parent: 'the-zao',
    status: 'live',
    chain: 'optimism',
    hatsTreeId: '226',
    homepage: 'https://hats.thezao.com',
    links: [
      {
        title: 'ZAO Hats Tree',
        url: 'https://hats.thezao.com',
        description: 'Org structure on Hats Protocol (Optimism, treeId 226)'
      }
    ]
  },

  // $ZAO Respect — soulbound reputation token (distinct from tradable $ZABAL)
  {
    slug: 'zao-respect-token',
    name: '$ZAO Respect',
    tagline: 'Soulbound reputation token for ZAO members',
    description: 'The $ZAO Respect token is illiquid (not for sale or trade) and soulbound (non-transferable), representing a member\'s on-chain identity and contributions to The ZAO. Allocated via the Respect Game / Hats role tree — distinct from the tradable $ZABAL token.',
    stage: 'active',
    tier: 'project',
    parent: 'the-zao',
    status: 'live',
    homepage: 'https://www.thezao.com/zao-token',
    links: [
      { title: '$ZAO Token page', url: 'https://www.thezao.com/zao-token', description: 'Soulbound reputation token overview' },
      { title: 'ZTalent Whitepaper (HackMD)', url: 'https://hackmd.io/u9jZ5Q1BR_uUwmRuksvF6Q', description: 'The ZAO / ZTalent governance doc' }
    ]
  },

  // ZAO Music artist roster (sub-brands under The ZAO). Profiles live at thezao.com/artists/<slug>.
  // Socials are search-derived where included — verify before treating as canonical.
  {
    slug: 'faetd',
    name: 'FAETD',
    tagline: 'House producer & sound engineer',
    description: 'Filip, aka FAETD — a music producer and sound engineer with 10+ years making electronic music, mainly house. ZAO Music artist.',
    stage: 'active',
    tier: 'sub-brand',
    parent: 'the-zao',
    status: 'live',
    homepage: 'https://www.thezao.com/artists/faetd',
    links: [
      { title: 'ZAO Music profile', url: 'https://www.thezao.com/artists/faetd', description: 'Artist page on The ZAO' },
      { title: 'SoundCloud', url: 'https://soundcloud.com/faetd', description: 'Music platform' }
    ]
  },

  {
    slug: 'losi',
    name: 'Losi',
    tagline: 'Singer-songwriter from Cali, Colombia',
    description: 'Singer-songwriter, creative, and entrepreneur from Cali, Colombia, selling her songs to collectors onchain. ZAO Music artist.',
    stage: 'active',
    tier: 'sub-brand',
    parent: 'the-zao',
    status: 'live',
    homepage: 'https://www.thezao.com/artists/losi',
    links: [
      { title: 'ZAO Music profile', url: 'https://www.thezao.com/artists/losi', description: 'Artist page on The ZAO' }
    ]
  },

  {
    slug: 'goldilox',
    name: 'Goldilox',
    tagline: 'Reggaeton & Hip-Hop artist (NYC)',
    description: 'Reggaeton and Hip-Hop artist from NYC by way of Asturias, Spain. "Saab Story" debuted on Spotify\'s New Music Friday Latin. ZAO Music artist.',
    stage: 'active',
    tier: 'sub-brand',
    parent: 'the-zao',
    status: 'live',
    homepage: 'https://www.thezao.com/artists/goldilox',
    links: [
      { title: 'ZAO Music profile', url: 'https://www.thezao.com/artists/goldilox', description: 'Artist page on The ZAO' },
      { title: 'Website', url: 'https://www.yesiamgoldilocks.com', description: 'Official site' },
      { title: 'Instagram', url: 'https://www.instagram.com/yesiamgoldilocks', description: '@yesiamgoldilocks' }
    ]
  },

  {
    slug: 'clejan',
    name: 'Clejan',
    tagline: 'The Trap Violinist',
    description: 'American rapper, singer, songwriter and classically trained violinist ("The Trap Violinist"), from Atlanta and based in LA. ZAO Music artist.',
    stage: 'active',
    tier: 'sub-brand',
    parent: 'the-zao',
    status: 'live',
    homepage: 'https://www.thezao.com/artists/clejan',
    links: [
      { title: 'ZAO Music profile', url: 'https://www.thezao.com/artists/clejan', description: 'Artist page on The ZAO' },
      { title: 'Website', url: 'https://clejan.com', description: 'Official site' },
      { title: 'Spotify', url: 'https://open.spotify.com/artist/6CbxzZHyeIz1Pig7giCufl', description: 'Music platform' },
      { title: 'Instagram', url: 'https://www.instagram.com/thetrapviolinist', description: '@thetrapviolinist' }
    ]
  },

  {
    slug: 'nessytherilla',
    name: 'NessytheRilla',
    tagline: 'Detroit rapper',
    description: 'Detroit, Michigan rapper. Began writing raps at 8 and making music at 15; has opened for major mainstream artists. ZAO Music artist.',
    stage: 'active',
    tier: 'sub-brand',
    parent: 'the-zao',
    status: 'live',
    homepage: 'https://www.thezao.com/artists/nessytherilla',
    links: [
      { title: 'ZAO Music profile', url: 'https://www.thezao.com/artists/nessytherilla', description: 'Artist page on The ZAO' },
      { title: 'SoundCloud', url: 'https://soundcloud.com/nessytherilla', description: 'Music platform' },
      { title: 'Facebook', url: 'https://www.facebook.com/nessytherilla', description: 'Official page' }
    ]
  },

  {
    slug: 'attabotty',
    name: 'Attabotty',
    tagline: 'Composer & audiovisual storyteller',
    description: 'Composer, multi-instrumentalist, and audiovisual storyteller fusing 2D/3D animation with EDM, lo-fi, and cinematic orchestra. Named among The ZAO cofounders; co-founder of ZAO Festivals. ZAO Music artist.',
    stage: 'active',
    tier: 'sub-brand',
    parent: 'the-zao',
    status: 'live',
    homepage: 'https://www.thezao.com/artists/attabotty',
    links: [
      { title: 'ZAO Music profile', url: 'https://www.thezao.com/artists/attabotty', description: 'Artist page on The ZAO' },
      { title: 'Website', url: 'https://www.attabotty.com', description: 'Official audiovisual art site' }
    ]
  }
];

export function getBrandBySlug(slug: string): Brand | undefined {
  return brands.find(b => b.slug === slug);
}

export function getBrandsByStage(stage: BrandStage): Brand[] {
  return brands.filter(b => b.stage === stage);
}

export function getBrandsByTier(tier: BrandTier): Brand[] {
  return brands.filter(b => b.tier === tier);
}

export function getBrandChildren(parentSlug: string): Brand[] {
  return brands.filter(b => b.parent === parentSlug);
}

export function getAllStages(): BrandStage[] {
  const stages = new Set<BrandStage>();
  brands.forEach(b => stages.add(b.stage));
  return Array.from(stages).sort();
}
