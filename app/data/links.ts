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

export const linksData: MainCategory[] = [
  {
    mainCategory: "The ZAO",
    subcategories: [
      {
        subTitle: "Core",
        links: [
          { title: "Website", url: "https://thezao.com", description: "Official ZAO website", audience: "both", featured: true },
          { title: "About", url: "https://thezao.com/about", description: "Learn about The ZAO", audience: "both" },
          { title: "Community", url: "https://thezao.com/community", description: "ZAO community hub", audience: "community" },
          { title: "Timeline", url: "https://thezao.com/timeline", description: "ZAO history and timeline", audience: "both" },
          { title: "Newsletter (Paragraph)", url: "https://paragraph.xyz/@thezao", description: "Read ZAO updates", audience: "both" },
          { title: "Farcaster channel", url: "https://farcaster.xyz/~/channel/zao", description: "Join /zao Farcaster channel", audience: "both" },
          { title: "X / Twitter", url: "https://x.com/thezao", description: "Follow @thezao", audience: "both" },
          { title: "POIDH", url: "https://poidh.xyz/a/thezao", description: "ZAO on POIDH", audience: "ecosystem" }
        ]
      },
      {
        subTitle: "Development",
        links: [
          { title: "GitHub - ZAOOS", url: "https://github.com/bettercallzaal/ZAOOS", description: "Main codebase", audience: "ecosystem" },
          { title: "Research library", url: "https://github.com/bettercallzaal/ZAOOS/tree/main/research", description: "540+ research docs", audience: "both" }
        ]
      },
      {
        subTitle: "Calendars & Coordination",
        links: [
          { title: "ZAO Calendar", url: "https://lu.ma/zao", description: "ZAO events and updates", audience: "both" },
          { title: "ZAO Music Calendar", url: "https://lu.ma/zao-m", description: "Music-specific events", audience: "community" },
          { title: "Huddle01 Meeting Room", url: "https://huddle01.app", description: "Join ZAO meetings", audience: "community" }
        ]
      },
      {
        subTitle: "Whitepaper & Documentation",
        links: [
          { title: "ZAO Whitepaper Draft", url: "https://charmverse.io/thezao", description: "Community whitepaper", audience: "ecosystem" }
        ]
      },
      {
        subTitle: "Giving & Support",
        links: [
          { title: "Donate via Giveth", url: "https://giveth.io/project/the-zao", description: "Support The ZAO", audience: "ecosystem" }
        ]
      }
    ]
  },
  {
    mainCategory: "ZAO OS",
    subcategories: [
      {
        subTitle: "Surfaces & Apps",
        links: [
          { title: "Main app", url: "https://zaoos.com", description: "The ZAO OS core app", audience: "community", featured: true },
          { title: "Member portal", url: "https://portal.zaoos.com", description: "Authenticated member area", audience: "community" },
          { title: "Chat (ZOE)", url: "https://chat.zaoos.com", description: "Automated chat interface", audience: "both" },
          { title: "Claude agent", url: "https://claude.zaoos.com", description: "Claude-powered assistant", audience: "both" },
          { title: "Agent registry", url: "https://agents.zaoos.com", description: "Autonomous agent listing", audience: "ecosystem" },
          { title: "Agent orchestrator", url: "https://ao.zaoos.com", description: "Agent coordination platform", audience: "ecosystem" },
          { title: "Paperclip", url: "https://paperclip.zaoos.com", description: "Knowledge management surface", audience: "ecosystem" },
          { title: "Pixels", url: "https://pixels.zaoos.com", description: "Pixel art agent interface", audience: "ecosystem" }
        ]
      },
      {
        subTitle: "Development & API",
        links: [
          { title: "Public API + MCP", url: "https://api.zaoos.com/mcp", description: "Developer API and MCP server", audience: "ecosystem" }
        ]
      }
    ]
  },
  {
    mainCategory: "ZAO Festivals",
    subcategories: [
      {
        subTitle: "ZAO Festivals",
        links: [
          { title: "Website", url: "https://zaofestivals.com", description: "Official Festivals site", audience: "both", featured: true },
          { title: "Instagram", url: "https://www.instagram.com/zaofestivals", description: "Follow @zaofestivals", audience: "both" },
          { title: "X / Twitter", url: "https://x.com/zaofestivals", description: "Follow @zaofestivals", audience: "both" },
          { title: "Facebook", url: "https://www.facebook.com/zaofestivals", description: "Follow on Facebook", audience: "both" },
          { title: "LinkedIn", url: "https://www.linkedin.com/company/zaofestivals", description: "Follow on LinkedIn", audience: "both" },
          { title: "YouTube Channel", url: "https://www.youtube.com/c/zaofestivals", description: "ZAO Festivals videos", audience: "both" },
          { title: "YouTube Playlist", url: "https://www.youtube.com/playlist?list=PLAJfhSekeHMLPEd-PjFnuU_UZmXFR5kvA", description: "Festival recaps and performances", audience: "both" },
          { title: "ZAO-Palooza collectible", url: "https://app.manifold.xyz/c/zao-card-jango-uu-zaopalooza", description: "Jango UU edition collectible", audience: "both" },
          { title: "Merch Shop", url: "https://merch.zaofestivals.com", description: "ZAO Festivals merchandise", audience: "both" }
        ]
      },
      {
        subTitle: "ZAO Music & Playlists",
        links: [
          { title: "Spotify Playlist", url: "https://open.spotify.com/playlist/thezao", description: "ZAO curated music", audience: "both" },
          { title: "Sound.xyz Playlist", url: "https://sound.xyz/collections/thezao", description: "ZAO on Sound.xyz", audience: "both" }
        ]
      },
      {
        subTitle: "ZAO Interviews & Media",
        links: [
          { title: "CMOTM Interview #1", url: "https://paragraph.com/@thezao/cmotm-1", description: "Creator of the Month interview", audience: "both" },
          { title: "CMOTM Interview #2", url: "https://paragraph.com/@thezao/cmotm-2", description: "Creator of the Month interview", audience: "both" },
          { title: "CMOTM Interview #3", url: "https://paragraph.com/@thezao/cmotm-3", description: "Creator of the Month interview", audience: "both" },
          { title: "CMOTM Interview #4", url: "https://paragraph.com/@thezao/cmotm-4", description: "Creator of the Month interview", audience: "both" },
          { title: "CMOTM Interview #5", url: "https://paragraph.com/@thezao/cmotm-5", description: "Creator of the Month interview", audience: "both" },
          { title: "CMOTM Interview #6", url: "https://paragraph.com/@thezao/cmotm-6", description: "Creator of the Month interview", audience: "both" },
          { title: "CMOTM Interview #7", url: "https://paragraph.com/@thezao/cmotm-7", description: "Creator of the Month interview", audience: "both" },
          { title: "CMOTM Interview #8", url: "https://paragraph.com/@thezao/cmotm-8", description: "Creator of the Month interview", audience: "both" }
        ]
      }
    ]
  },
  {
    mainCategory: "ZAO Stock",
    subcategories: [
      {
        subTitle: "2026 Festival",
        links: [
          { title: "Team bot (Telegram)", url: "https://t.me/ZAOstockTeamBot", description: "Coordinate with ZAO Stock team", audience: "community" }
        ]
      }
    ]
  },
  {
    mainCategory: "Community Projects",
    subcategories: [
      {
        subTitle: "COC Concertz",
        links: [
          { title: "Website", url: "https://cocconcertz.com", description: "Concert promotion arm", audience: "ecosystem", featured: true }
        ]
      },
      {
        subTitle: "FISHBOWLZ",
        links: [
          { title: "Website", url: "https://fishbowlz.xyz", description: "Audio rooms platform (paused)", audience: "ecosystem" },
          { title: "Rooms", url: "https://fishbowlz.xyz/rooms/", description: "Browse FISHBOWLZ rooms", audience: "ecosystem" }
        ]
      },
      {
        subTitle: "WaveWarZ",
        links: [
          { title: "Main site", url: "https://wavewarz.com", description: "Music prediction market", audience: "ecosystem", featured: true },
          { title: "Alt site", url: "https://wavewarz.info", description: "Alternative WaveWarZ domain", audience: "ecosystem" },
          { title: "Intelligence dashboard", url: "https://wavewarz-intelligence.vercel.app", description: "Analytics dashboard", audience: "ecosystem" },
          { title: "Fan app (beta)", url: "https://wavewarzapp.vercel.app", description: "Community fan app", audience: "ecosystem" },
          { title: "X / Twitter", url: "https://x.com/WaveWarZ", description: "Follow WaveWarZ", audience: "ecosystem" },
          { title: "GitHub - base", url: "https://github.com/CandyToyBox/wavewarz-base", description: "Core codebase", audience: "ecosystem" },
          { title: "GitHub - intelligence", url: "https://github.com/CandyToyBox/wavewarz-intelligence", description: "Analytics module", audience: "ecosystem" },
          { title: "GitHub - merch shop", url: "https://github.com/CandyToyBox/wavewarz-merch-shop", description: "Merchandise platform", audience: "ecosystem" },
          { title: "GitHub - fan app", url: "https://github.com/bettercallzaal/wavewarzapp", description: "Fan application repo", audience: "ecosystem" }
        ]
      },
      {
        subTitle: "SongJam & $SANG",
        links: [
          { title: "Website", url: "https://songjam.space", description: "Music-AI tooling platform", audience: "ecosystem", featured: true },
          { title: "ZABAL hub on SongJam", url: "https://songjam.space/zabal", description: "ZABAL token presence", audience: "ecosystem" },
          { title: "Leaderboard", url: "https://leaderboard.songjam.space", description: "Competition leaderboard", audience: "ecosystem" },
          { title: "Docs", url: "https://docs.songjam.space", description: "Developer documentation", audience: "ecosystem" },
          { title: "GitHub org", url: "https://github.com/SongjamSpace", description: "SongJam repositories", audience: "ecosystem" },
          { title: "Adam on X", url: "https://x.com/adam_songjam", description: "Follow Adam", audience: "ecosystem" },
          { title: "CoinGecko ($SANG)", url: "https://www.coingecko.com/en/coins/songjam-by-virtuals", description: "Token price and info", audience: "ecosystem" }
        ]
      },
      {
        subTitle: "$Loanz",
        links: [
          { title: "Website", url: "https://studentloanz.xyz", description: "Student loans platform", audience: "ecosystem", featured: true },
          { title: "ZAO.lol Memebook", url: "https://zao.lol", description: "ZAO memebook and culture", audience: "community" },
          { title: "Whitepaper", url: "https://paragraph.xyz/@thezao/student-loanz-whitepaper", description: "Student Loanz whitepaper", audience: "ecosystem" },
          { title: "Daily Spaces on X", url: "https://x.com/loanzonbase", description: "Follow @loanzonbase for Daily Spaces", audience: "ecosystem" }
        ]
      },
      {
        subTitle: "ZVerse",
        links: [
          { title: "ZVerse", url: "https://thezao.xyz", description: "ZAO on Hivemind (ZVerse)", audience: "community" }
        ]
      },
      {
        subTitle: "Hats Tree - Org Chart",
        links: [
          { title: "ZAO Hats Tree", url: "https://hats.thezao.com", description: "ZAO organizational structure on Hats Protocol (Optimism, treeId 226)", audience: "ecosystem" }
        ]
      },
      {
        subTitle: "ZABAL Gamez (Season 1)",
        links: [
          { title: "ZABAL Gamez Empire", url: "https://empirebuilder.world/empire/zabalgamez01e9af", description: "Tokenless ZABAL Gamez Empire created live on Day 1 (Jun 1 2026)", audience: "both" }
        ]
      }
    ]
  },
  {
    mainCategory: "BetterCallZaal",
    subcategories: [
      {
        subTitle: "Zaal & Consulting",
        links: [
          { title: "Website", url: "https://bettercallzaal.com", description: "BetterCallZaal main site", audience: "ecosystem", featured: true },
          { title: "X / Twitter", url: "https://x.com/bettercallzaal", description: "Follow @bettercallzaal", audience: "ecosystem" },
          { title: "Farcaster", url: "https://farcaster.xyz/bettercallzaal", description: "Farcaster profile (FID 19640)", audience: "ecosystem" },
          { title: "Instagram", url: "https://instagram.com/bettercallzaal", description: "Follow on Instagram", audience: "ecosystem" },
          { title: "LinkedIn", url: "https://www.linkedin.com/in/zaalp/", description: "Zaal on LinkedIn", audience: "ecosystem" },
          { title: "GitHub org", url: "https://github.com/bettercallzaal", description: "Organization repositories", audience: "ecosystem" },
          { title: "Book a call", url: "https://calendly.com/zaalp99/30minmeeting", description: "Schedule meeting with Zaal", audience: "ecosystem" }
        ]
      },
      {
        subTitle: "Zaal Interviews",
        links: [
          { title: "YouTube Interview #1", url: "https://youtube.com/c/bettercallzaal/videos", description: "Zaal on YouTube", audience: "ecosystem" },
          { title: "YouTube Interview #2", url: "https://youtube.com/@bettercallzaal", description: "Zaal's YouTube channel", audience: "ecosystem" }
        ]
      },
      {
        subTitle: "BCZ YapZ",
        links: [
          { title: "Website", url: "https://bczyapz.com", description: "Long-form interview podcast", audience: "ecosystem", featured: true },
          { title: "Episodes", url: "https://bczyapz.com/ep/", description: "Episode library", audience: "ecosystem" },
          { title: "RSS feed", url: "https://bczyapz.com/feed.xml", description: "Podcast RSS feed", audience: "ecosystem" }
        ]
      },
      {
        subTitle: "Let's Talk About Ethereum",
        links: [
          { title: "Pods.media", url: "https://pods.media/lets-talk-about-web3/", description: "LTAE Podcast", audience: "ecosystem" },
          { title: "Spotify", url: "https://open.spotify.com/show/1Bk6bsMYciOMyJohMVZUgt", description: "Listen on Spotify", audience: "ecosystem" }
        ]
      }
    ]
  },
  {
    mainCategory: "Ecosystem & Tokens",
    subcategories: [
      {
        subTitle: "ZOE (Agent)",
        links: [
          { title: "Chat interface", url: "https://chat.zaoos.com", description: "Autonomous ecosystem agent", audience: "both" },
          { title: "Claude-backed", url: "https://claude.zaoos.com", description: "Claude-powered version", audience: "both" }
        ]
      },
      {
        subTitle: "$ZABAL Token",
        links: [
          { title: "Empire profile", url: "https://empirebuilder.world/profile/0x7234c36A71ec237c2Ae7698e8916e0735001E9Af", description: "Empire Builder profile", audience: "ecosystem" },
          { title: "Leaderboard API", url: "https://empirebuilder.world/api/leaderboards?tokenAddress=0xbB48f19B0494Ff7C1fE5Dc2032aeEE14312f0b07", description: "Leaderboard data", audience: "ecosystem" },
          { title: "Bonfires graph", url: "https://graph.bonfires.ai/zabal", description: "Knowledge graph", audience: "ecosystem" },
          { title: "Incented org", url: "https://incented.co/organizations/zabal", description: "Incentives management", audience: "ecosystem" },
          { title: "ZABAL on SongJam", url: "https://songjam.space/zabal", description: "ZABAL hub on SongJam", audience: "ecosystem" },
          { title: "Magnetiq Connector (zabal.lol)", url: "https://app.magnetiq.xyz/brand/ZABAL/magnet/Zabal%20Connector", description: "ZABAL Connector magnet — vanity zabal.lol", audience: "ecosystem" }
        ]
      }
    ]
  },
  {
    mainCategory: "Artists & Sub-brands",
    subcategories: [
      {
        subTitle: "Tom Fellenz / Thy Revolution",
        links: [
          { title: "Website", url: "https://fellenz.net", description: "Tom Fellenz main site", audience: "ecosystem" },
          { title: "Alt site", url: "https://tomfellenz.com", description: "Alternative domain", audience: "ecosystem" },
          { title: "Linktree", url: "https://linktr.ee/fellenzmusic", description: "All Tom Fellenz links", audience: "ecosystem" },
          { title: "SoundCloud", url: "https://soundcloud.com/tomfellenz", description: "Music platform", audience: "ecosystem" },
          { title: "LinkedIn", url: "https://www.linkedin.com/in/tomfellenz/", description: "Professional profile", audience: "ecosystem" }
        ]
      },
      {
        subTitle: "Stilo World",
        links: [
          { title: "Website", url: "https://www.stilo.world", description: "Stilo World main site", audience: "ecosystem" },
          { title: "Music site", url: "https://www.stilosd.com/music", description: "Music portfolio", audience: "ecosystem" },
          { title: "SoundCloud", url: "https://soundcloud.com/stilosd", description: "Music platform", audience: "ecosystem" },
          { title: "X / Twitter", url: "https://x.com/stilo_world", description: "Follow on X", audience: "ecosystem" }
        ]
      },
      {
        subTitle: "Joseph Goats",
        links: [
          { title: "SoundCloud", url: "https://soundcloud.com/luijoseph", description: "Music platform", audience: "ecosystem" }
        ]
      },
      {
        subTitle: "Ritzy Periwinkle",
        links: [
          { title: "Website", url: "https://www.ritzyperiwinkle.com", description: "Personal site", audience: "ecosystem" },
          { title: "X / Twitter", url: "https://x.com/ritzy_p", description: "Follow on X", audience: "ecosystem" },
          { title: "Instagram", url: "https://instagram.com/ritzyp", description: "Follow on Instagram", audience: "ecosystem" },
          { title: "LinkedIn", url: "https://linkedin.com/in/ritzyp", description: "Professional profile", audience: "ecosystem" }
        ]
      }
    ]
  },
  {
    mainCategory: "ZAO Onchain",
    subcategories: [
      {
        subTitle: "ZAO Tokens",
        links: [
          { title: "Mint ZAO-CHELLA Vibez Track on Zora", url: "https://song.thezao.com", description: "Own a piece of the ZAO-CHELLA experience by minting the Vibez track.", audience: "community" },
          { title: "Mint Attabotty ZAO-PALOOZA Card", url: "https://attabotty.zao.cards", description: "Collect the limited-edition Attabotty artist card from ZAO-PALOOZA.", audience: "community" },
          { title: "Mint Zalora – the ZAO Mascot (MidiVerse)", url: "https://zalora.thezao.com", description: "Bring Zalora into your wallet – the on-chain mascot of the ZAO.", audience: "community" }
        ]
      },
      {
        subTitle: "ZAO Tracks",
        links: [
          { title: "ZAO song #1: ZAO-CHELLA VIBEZ", url: "https://zora.co/collect/base:0x1458f7d12c1fe1747e13793d99dcb6da6f9d6123/1?referrer=0xa46b072e6607d37413000220653d3bca5be32513", description: "Vibe to the first official ZAO track from ZAO-CHELLA.", audience: "community" },
          { title: "ZAO song #2: ZAO-CHELLA CYPHER", url: "https://www.thezao.com/zao-cypher", description: "Listen to the multi-artist Cypher track from ZAO-CHELLA.", audience: "community" },
          { title: "ZAO song #3: Side by Side (ZAO Side)", url: "https://ima.midipunkz.com/midivaderz/side-by-side-thezao", description: "Watch the Side-by-Side collab in MidiVaderZ – ZAO's side.", audience: "community" },
          { title: "ZAO song #3.1: Side by Side (MidiPunkz Side)", url: "https://ima.midipunkz.com/midivaderz/side-by-side-midipunkz", description: "Watch the Side-by-Side collab in MidiVaderZ – MidiPunkz's side.", audience: "community" }
        ]
      }
    ]
  },
  {
    mainCategory: "Community & Collaboration",
    subcategories: [
      {
        subTitle: "MidiPunkZ",
        links: [
          { title: "Main website", url: "https://midipunkz.com/", description: "The official MidiPunkZ website.", audience: "ecosystem" },
          { title: "MidiVaderz game", url: "https://midipunkz.com/games", description: "Play MidiVaderz on the MidiPunkZ website.", audience: "ecosystem" },
          { title: "MidiPunkz Community", url: "https://ima.midipunkz.com/communities/midipunkz", description: "Join the MidiPunkz community on IMA.", audience: "ecosystem" },
          { title: "FeatherFrogs Community", url: "https://ima.midipunkz.com/communities/featherfrogs", description: "Explore the FeatherFrogs community on IMA.", audience: "ecosystem" },
          { title: "Midi Avatars", url: "https://midipunkz.com/midiezz", description: "Browse and collect MidiPunkz avatars.", audience: "ecosystem" },
          { title: "ZAO Community Page", url: "https://ima.midipunkz.com/communities/the-zao", description: "ZAO's community space on midipunkz.com.", audience: "community" }
        ]
      }
    ]
  }
];
