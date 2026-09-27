// Archived brands retired from active ecosystem directory per Zaal ruling 2026-07-31.
import type { Brand } from './brands';

export const retiredBrands: Brand[] = [
  {
    slug: 'magnetiq',
    name: 'Magnetiq',
    tagline: 'Brand-magnet platform partnered with ZABAL',
    description: 'Magnetiq powers the ZABAL Connector magnet at zabal.lol -> app.magnetiq.xyz/brand/ZABAL. Partnership for ecosystem activation flows.',
    stage: 'paused',
    tier: 'sub-brand',
    parent: 'bettercallzaal',
    status: 'paused',
    homepage: 'https://app.magnetiq.xyz/brand/ZABAL/magnet/Zabal%20Connector',
    x: 'magnetiq_xyz',
    links: [
      {
        title: 'ZABAL Connector (zabal.lol)',
        url: 'https://app.magnetiq.xyz/brand/ZABAL/magnet/Zabal%20Connector',
        description: 'Vanity: zabal.lol -> ZABAL magnet on Magnetiq'
      }
    ]
  }
];
