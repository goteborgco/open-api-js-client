import { Translations } from './Translations';
import { Media } from './Media';
import { Location } from './Location';
import { Contact } from './Contact';
import { EventDate } from './EventDate';
import { CurrentInTime } from './CurrentInTime';

interface MediaData {
  id: number;
  credit?: string;
  caption?: string;
  alt_text?: string;
  media_type?: string;
  mime_type?: string;
  sizes: Record<string, { width: number; height: number; source_url: string }>;
}

export class WpEntity {
  readonly id: number;
  readonly title: string;
  readonly excerpt: string;
  readonly content?: string;
  readonly date: string;
  readonly modified?: string;
  readonly link?: string;
  readonly categories: number[];
  readonly areas: number[];
  readonly tags: number[];
  readonly category_heading?: string;
  private featuredmedia?: Media[];
  readonly gallery?: Media[];
  readonly location?: Location;
  readonly dates?: EventDate[];
  readonly contact?: Contact;
  readonly current_in_time?: CurrentInTime;
  readonly translations?: Translations;
  readonly place_id?: number;
  readonly is_free?: boolean;
  readonly lang: 'en' | 'sv';

  constructor(data: any) {    
    this.id = data.id;
    this.title = data.title || '';
    this.excerpt = data.excerpt || '';
    this.content = data.content;
    this.date = data.date || new Date().toISOString();
    this.modified = data.modified;
    this.link = data.link;
    this.categories = data.categories || [];
    this.areas = data.areas || [];
    this.tags = data.tags || [];
    this.category_heading = data.category_heading;
    this.featuredmedia = data.featuredmedia ? (Array.isArray(data.featuredmedia) ? data.featuredmedia.map((m: any) => new Media(m)) : [new Media(data.featuredmedia)]) : undefined;
    this.gallery = data.gallery ? (Array.isArray(data.gallery) ? data.gallery : [data.gallery]).map((item: MediaData) => new Media(item)) : undefined;
    this.location = data.location ? new Location(data.location) : undefined;
    this.dates = data.dates ? data.dates.map((date: any) => new EventDate(date)) : undefined;
    this.contact = data.contact ? new Contact(data.contact) : undefined;
    this.current_in_time = data.current_in_time ? new CurrentInTime(data.current_in_time) : undefined;
    this.translations = data.translations ? new Translations(data.translations) : undefined;
    this.place_id = data.place_id;
    this.is_free = data.is_free;
    this.lang = data.lang || 'sv';
  }

  /**
   * Get the featured media
   * @returns The first featured media item or undefined if no media exists
   */
  getFeaturedMedia(): Media | undefined {
    return this.featuredmedia?.[0];
  }

  /**
   * Get the main image URL
   * @param size The desired image size ('full', 'large', 'medium', 'thumbnail')
   * @returns The URL for the requested size or undefined
   */
  getImageUrl(size: 'full' | 'large' | 'medium' | 'thumbnail' = 'full'): string | undefined {
    return this.getFeaturedMedia()?.getUrl(size);
  }

  /**
   * Get all gallery image URLs
   * @param size The desired image size ('full', 'large', 'medium', 'thumbnail')
   * @returns Array of gallery image URLs
   */
  getGalleryUrls(size: 'full' | 'large' | 'medium' | 'thumbnail' = 'full'): string[] {
    return this.gallery?.map(image => image.getUrl(size)).filter((url): url is string => url !== undefined) || [];
  }

  /**
   * Check if the entity is currently active based on its dates
   * @returns boolean indicating if the entity is currently active
   */
  isActive(): boolean {
    if (!this.dates?.length) return true;
    return this.dates.some(date => date.isActive());
  }

  /**
   * Get the location coordinates
   * @returns Object containing lat and lng, or undefined if no location exists
   */
  getCoordinates(): { lat: number; lng: number } | undefined {
    return this.location?.getCoordinates();
  }

  /**
   * Get a formatted address string
   * @returns Formatted address string or undefined if no location exists
   */
  getFormattedAddress(): string | undefined {
    return this.location?.getFormattedAddress();
  }

  /**
   * Get contact information
   * @returns Contact information or undefined if no contact exists
   */
  getContact(): Contact | undefined {
    return this.contact;
  }

  /**
   * Get translation for a specific language
   * @param lang Language code ('en' or 'sv')
   * @returns Translation ID or undefined if no translation exists
   */
  getTranslation(lang: 'en' | 'sv'): number | undefined {
    return this.translations?.getTranslation(lang);
  }

  /**
   * Get current in time information
   * @returns CurrentInTime information or undefined if not available
   */
  getCurrentInTime(): CurrentInTime | undefined {
    return this.current_in_time;
  }
} 