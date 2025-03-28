import { Client } from '../client/Client';
import type { PlaceFilter } from '../interfaces/common';
import { WpEntity as WpEntityClass } from '../entities/WpEntity';
import { Related as RelatedClass } from '../entities/Related';
import { Markers as MarkersClass } from '../entities/Markers';

export interface SinglePlaceResponse {
  place: WpEntityClass;
  events: WpEntityClass[];
  related?: RelatedClass;
  markers?: MarkersClass;
}

/**
 * Places API for accessing place content
 * 
 * This class provides type-safe methods for querying and retrieving place content
 * from the GraphQL API.
 */
export class Places {
  private readonly defaultPlaceFields = `
    id
    title
    excerpt
    content
    date
    modified
    link
    categories
    areas
    tags
    category_heading
    featuredmedia {
      id
      credit
      caption
      alt_text
      media_type
      mime_type
      sizes {
        medium {
          width
          height
          source_url
        }
        full {
          width
          height
          source_url
        }
      }
    }
    gallery {
      id
      credit
      caption
      sizes {
        full {
          width
          height
          source_url
        }
      }
    }
    contact {
      email
      phone
      website
      facebook
      instagram
    }
    location {
      address
      lat
      lng
      zoom
      place_id
      name
      street_number
      street_name
      state
      post_code
      country
      country_short
    }
    currentInTime {
      months
      weekdays
    }
    translations {
      en
      sv
    }
  `;

  private readonly defaultMarkersFields = `
    type
    features {
      type
      geometry {
        type
        coordinates
      }
      properties {
        id
        name
        icon
        type
        slug
      }
    }
  `;

  constructor(private client: Client) {}

  /**
   * List places with optional filtering
   * 
   * @param filter Optional filtering options
   * @param fields Optional GraphQL fields to return
   * @returns Array of place entities and optional markers
   */
  async list(
    filter: PlaceFilter,
    fields?: string
  ): Promise<{ places: WpEntityClass[]; markers?: MarkersClass }> {
    const defaultFields = `
      places {
        ${this.defaultPlaceFields}
      }
      markers {
        ${this.defaultMarkersFields}
      }
    `;

    // Convert filter object to GraphQL arguments format
    const filterArgs = Object.entries(filter)
      .map(([key, value]) => {
        if (Array.isArray(value)) {
          return `${key}: [${value.join(', ')}]`;
        }
        if (typeof value === 'string') {
          return `${key}: "${value}"`;
        }
        return `${key}: ${value}`;
      })
      .join(', ');

    const query = `
      query {
        places(${filterArgs ? `filter: { ${filterArgs} }` : ''}) {
          ${fields || defaultFields}
        }
      }
    `;

    const response = await this.client.execute<{ places: { places: any[]; markers?: any } }>(query);
    return {
      places: response.places.places.map(place => new WpEntityClass(place)),
      markers: response.places.markers ? new MarkersClass(response.places.markers) : undefined
    };
  }

  /**
   * Get a specific place by ID
   * 
   * @param id The place ID
   * @param lang Language code ('en' or 'sv')
   * @param fields Optional GraphQL fields to return
   * @returns Place entity with associated events, related content, and markers
   */
  async getById(
    id: number,
    lang: 'en' | 'sv',
    fields?: string
  ): Promise<SinglePlaceResponse> {
    const defaultFields = `
      place {
        ${this.defaultPlaceFields}
      }
      events {
        ${this.defaultPlaceFields}
      }
      related {
        events {
          ${this.defaultPlaceFields}
        }
        guides {
          ${this.defaultPlaceFields}
        }
        places {
          ${this.defaultPlaceFields}
        }
      }
      markers {
        ${this.defaultMarkersFields}
      }
    `;

    const query = `
      query {
        placeById(filter: { id: ${id}, lang: ${lang} }) {
          ${fields || defaultFields}
        }
      }
    `;

    const response = await this.client.execute<{ placeById: { place: any; events: any[]; related?: any; markers?: any } }>(query);
    return {
      place: new WpEntityClass(response.placeById.place),
      events: response.placeById.events?.map(event => new WpEntityClass(event)) || [],
      related: response.placeById.related ? new RelatedClass(response.placeById.related) : undefined,
      markers: response.placeById.markers ? new MarkersClass(response.placeById.markers) : undefined
    };
  }
} 