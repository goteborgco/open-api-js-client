export class Location {
  readonly address?: string;
  readonly lat?: number;
  readonly lng?: number;
  readonly zoom?: number;
  readonly place_id?: string;
  readonly name?: string;
  readonly street_number?: string;
  readonly street_name?: string;
  readonly state?: string;
  readonly post_code?: string;
  readonly country?: string;
  readonly country_short?: string;

  constructor(data: any) {
    this.address = data.address;
    this.lat = data.lat;
    this.lng = data.lng;
    this.zoom = data.zoom;
    this.place_id = data.place_id;
    this.name = data.name;
    this.street_number = data.street_number;
    this.street_name = data.street_name;
    this.state = data.state;
    this.post_code = data.post_code;
    this.country = data.country;
    this.country_short = data.country_short;
  }

  /**
   * Get coordinates as a lat/lng object
   * @returns Object containing lat and lng or undefined if coordinates are not set
   */
  getCoordinates(): { lat: number; lng: number } | undefined {
    if (!this.lat || !this.lng) return undefined;
    return { lat: this.lat, lng: this.lng };
  }

  /**
   * Get formatted address string
   * @returns Formatted address string or undefined if no address components exist
   */
  getFormattedAddress(): string | undefined {
    const parts = [
      this.street_name,
      this.street_number,
      this.post_code,
      this.state,
      this.country
    ].filter(Boolean);
    
    return parts.length > 0 ? parts.join(', ') : undefined;
  }

  /**
   * Get short formatted address (just street and number)
   * @returns Short address string or undefined if no street components exist
   */
  getShortAddress(): string | undefined {
    const parts = [
      this.street_name,
      this.street_number
    ].filter(Boolean);
    
    return parts.length > 0 ? parts.join(' ') : undefined;
  }
} 