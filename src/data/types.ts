export type Audience = 'community' | 'ecosystem' | 'both'

export interface ZaoLink {
  title: string
  url: string
  category: string
  subcategory: string
  description: string
  tags: string[]
  audience: Audience
  featured?: boolean
  addedDate?: string
}

export interface LinksPayload {
  source: string
  total: number
  count: number
  generatedAt: string
  links: ZaoLink[]
}
