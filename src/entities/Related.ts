import { WpEntity } from './WpEntity';

export class Related {
  readonly places?: WpEntity[];
  readonly guides?: WpEntity[];
  readonly events?: WpEntity[];

  constructor(data: any) {
    this.places = data.places?.map((place: any) => new WpEntity(place));
    this.guides = data.guides?.map((guide: any) => new WpEntity(guide));
    this.events = data.events?.map((event: any) => new WpEntity(event));
  }

  /**
   * Get related places
   * @returns Array of related places or undefined
   */
  getPlaces(): WpEntity[] | undefined {
    return this.places;
  }

  /**
   * Get related guides
   * @returns Array of related guides or undefined
   */
  getGuides(): WpEntity[] | undefined {
    return this.guides;
  }

  /**
   * Get related events
   * @returns Array of related events or undefined
   */
  getEvents(): WpEntity[] | undefined {
    return this.events;
  }

  /**
   * Get all related content
   * @returns Object containing all related content
   */
  getAllRelated(): { places?: WpEntity[]; guides?: WpEntity[]; events?: WpEntity[] } {
    return {
      places: this.places,
      guides: this.guides,
      events: this.events
    };
  }

  /**
   * Check if there is any related content
   * @returns Whether there is any related content
   */
  hasRelatedContent(): boolean {
    return Boolean(
      (this.places && this.places.length > 0) ||
      (this.guides && this.guides.length > 0) ||
      (this.events && this.events.length > 0)
    );
  }
} 