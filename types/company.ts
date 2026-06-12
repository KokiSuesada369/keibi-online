export type Company = {
  id: number
  slug: string
  name: string
  zip: string
  city: string | null
  tel: string
  url: string | null
  numbers: number[]
  pref?: string
  pref_slug?: string
  city_slug?: string | null
  address?: string | null
  featured?: boolean | null
}
