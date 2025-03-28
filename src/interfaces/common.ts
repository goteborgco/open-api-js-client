export interface Media {
  id: number;
  credit?: string;
  caption?: string;
  alt_text?: string;
  media_type?: string;
  mime_type?: string;
  sizes?: MediaSizes;

  getSizes(): MediaSizes;
  getUrl(size?: 'full' | 'large' | 'medium' | 'thumbnail'): string | undefined;
}

export interface MediaSizes {
  medium?: Image;
  thumbnail?: Image;
  large?: Image;
  full?: Image;

  getSize(size: 'full' | 'large' | 'medium' | 'thumbnail'): Image | undefined;
  getUrl(size: 'full' | 'large' | 'medium' | 'thumbnail'): string | undefined;
  getDimensions(size: 'full' | 'large' | 'medium' | 'thumbnail'): { width: number; height: number } | undefined;
}

export interface Image {
  width: number;
  height: number;
  source_url: string;
}

export interface Contact {
  email?: string;
  phone?: string;
  website?: string;
  facebook?: string;
  instagram?: string;

  getSocialLinks(): { facebook?: string; instagram?: string };
  getContactMethods(): { email?: string; phone?: string; website?: string };
  hasContactInfo(): boolean;
}

export interface Location {
  address?: string;
  lat?: number;
  lng?: number;
  zoom?: number;
  place_id?: string;
  name?: string;
  street_number?: string;
  street_name?: string;
  state?: string;
  post_code?: string;
  country?: string;
  country_short?: string;

  getCoordinates(): { lat: number; lng: number } | undefined;
  getFormattedAddress(): string | undefined;
  getShortAddress(): string | undefined;
}

export interface EventDate {
  start?: string;
  end?: string;

  isActive(): boolean;
  getFormattedRange(): string | undefined;
}

export interface CurrentInTime {
  months: number[];
  weekdays: number[];

  hasMonth(month: number): boolean;
  hasWeekday(weekday: number): boolean;
  isCurrentlyActive(): boolean;
  getFormattedSchedule(): string | undefined;
}

export interface Features {
  type: string;
  geometry: Geometry;
  properties: Properties;
}

export interface Geometry {
  type: string;
  coordinates: number[];
  latitude?: number;
  longitude?: number;
}

export interface Properties {
  name: string;
  id: number;
  icon: string;
  thumbnail: string;
  type: string;
  slug: string;
}

export interface Markers {
  type: string;
  features: Features[];
}

export interface Related {
  places?: WpEntity[];
  guides?: WpEntity[];
  events?: WpEntity[];

  getPlaces(): WpEntity[] | undefined;
  getGuides(): WpEntity[] | undefined;
  getEvents(): WpEntity[] | undefined;
  getAllRelated(): { places?: WpEntity[]; guides?: WpEntity[]; events?: WpEntity[] };
  hasRelatedContent(): boolean;
}

export interface Translations {
  sv?: number;
  en?: number;

  getTranslation(lang: 'en' | 'sv'): number | undefined;
  hasTranslation(lang: 'en' | 'sv'): boolean;
  getAvailableTranslations(): { lang: 'en' | 'sv'; id: number }[];
}

export interface WpEntity {
  id: number;
  date?: string;
  modified?: string;
  type?: string;
  link?: string;
  title?: string;
  content?: string;
  excerpt?: string;
  categories?: number[];
  areas?: number[];
  tags?: number[];
  invisible_tags?: number[];
  lang: 'en' | 'sv';
  translations?: Translations;
  featuredmedia?: Media[];
  category_heading?: string;
  gallery?: Media[];
  contact?: Contact;
  location?: Location;
  is_free?: boolean;
  dates?: EventDate[];
  place_id?: number;
  classification?: number;
  current_in_time?: CurrentInTime;

  getFeaturedMedia(): Media | undefined;
  getImageUrl(size?: 'full' | 'large' | 'medium' | 'thumbnail'): string | undefined;
  getGalleryUrls(size?: 'full' | 'large' | 'medium' | 'thumbnail'): string[];
  isActive(): boolean;
  getCoordinates(): { lat: number; lng: number } | undefined;
  getFormattedAddress(): string | undefined;
  getContact(): Contact | undefined;
  getTranslation(lang: 'en' | 'sv'): number | undefined;
  getCurrentInTime(): CurrentInTime | undefined;
}

export interface GuideFilter {
  lang: 'en' | 'sv';
  categories?: number[];
  areas?: number[];
  tags?: number[];
  invisible_tags?: number[];
  per_page?: number;
  page?: number;
}

export interface EventFilter {
  lang: 'en' | 'sv';
  places?: number[];
  categories?: number[];
  areas?: number[];
  tags?: number[];
  invisible_tags?: number[];
  free?: number;
  start?: string;
  end?: string;
  distance?: number;
  coords?: string;
  per_page?: number;
  page?: number;
}

export interface PlaceFilter {
  lang: 'en' | 'sv';
  places?: number[];
  categories?: number[];
  areas?: number[];
  tags?: number[];
  distance?: number;
  coords?: string;
  per_page?: number;
  page?: number;
}

export interface LangFilter {
  lang?: 'en' | 'sv';
}

export interface SearchFilter extends LangFilter {
  query: string;
}

export interface SortOptions {
  fields?: string | string[];
  orders?: 'asc' | 'desc' | ('asc' | 'desc')[];
}