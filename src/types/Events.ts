import { Client } from '../client/Client';
import type { SortOptions, EventFilter } from '../interfaces/common';
import { WpEntity as WpEntityClass } from '../entities/WpEntity';
import { Related as RelatedClass } from '../entities/Related';
import { Markers as MarkersClass } from '../entities/Markers';
import { gql } from '../utils/gql';

export interface SingleEventResponse {
  event: WpEntityClass;
  related?: RelatedClass;
  markers?: MarkersClass;
}

/**
 * Events API for accessing event content
 * 
 * This class provides type-safe methods for querying and retrieving event content
 * from the GraphQL API.
 */
export class Events {
  private readonly defaultEventFields = `
    areas
    categories
    category_heading
    classification
    contact {
      email
      facebook
      instagram
      phone
      website
    }
    currentInTime {
      months
      weekdays
    }
    date
    dates {
      end
      start
    }
    excerpt
    featuredmedia {
      alt_text
      caption
      credit
      id
      media_type
      mime_type
      sizes {
        full {
          height
          source_url
          width
        }
      }
    }
    free
    id
    invisible_tags
    lang
    link
    place_id
    tags
    title
    translations {
      en
      sv
    }
    type
  `;

  private readonly defaultMarkersFields = `
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
    type
  `;

  constructor(private client: Client) {}

  /**
   * List events with optional filtering and sorting
   * 
   * @param filter Optional filtering options
   * @param sortBy Optional sorting options
   * @param fields Optional GraphQL fields to return
   * @returns Array of event entities and markers
   */
  async list(
    filter: EventFilter,
    sortBy?: SortOptions,
    fields?: string
  ): Promise<{ events: WpEntityClass[]; markers?: MarkersClass }> {
    const defaultFields = `
      events {
        ${this.defaultEventFields}
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

    // Convert sortBy object to GraphQL arguments format if provided
    const sortArgs = sortBy ? Object.entries(sortBy)
      .map(([key, value]) => {
        if (key === 'orders') {
          // Handle orders as enum values
          if (Array.isArray(value)) {
            return `${key}: [${value.join(', ')}]`;
          }
          return `${key}: ${value}`;
        }
        if (Array.isArray(value)) {
          return `${key}: [${value.map(v => `"${v}"`).join(', ')}]`;
        }
        return `${key}: "${value}"`;
      })
      .join(', ') : '';

    const query = gql`
      query ListEvents {
        events(${filterArgs ? `filter: { ${filterArgs} }` : ''}${sortArgs ? `, sortBy: { ${sortArgs} }` : ''}) {
          ${fields || defaultFields}
        }
      }
    `;

    const response = await this.client.execute<{ events: { events: any[]; markers?: any } }>(query);
    return {
      events: response.events.events.map(event => new WpEntityClass(event)),
      markers: response.events.markers ? new MarkersClass(response.events.markers) : undefined
    };
  }

  /**
   * Get a specific event by ID
   * 
   * @param id The event ID
   * @param lang Language code ('en' or 'sv')
   * @param fields Optional GraphQL fields to return
   * @returns Event entity with related content and markers
   */
  async getById(
    id: number,
    lang: 'en' | 'sv',
    fields?: string
  ): Promise<SingleEventResponse> {
    const defaultFields = `
      event {
        ${this.defaultEventFields}
      }
      related {
        events {
          ${this.defaultEventFields}
        }
        guides {
          ${this.defaultEventFields}
        }
        places {
          ${this.defaultEventFields}
        }
      }
      markers {
        ${this.defaultMarkersFields}
      }
    `;

    const query = gql`
      query GetEventById {
        eventById(filter: { id: ${id}, lang: ${lang} }) {
          ${fields || defaultFields}
        }
      }
    `;

    const response = await this.client.execute<{ eventById: { event: any; related?: any; markers?: any } }>(query);
    return {
      event: new WpEntityClass(response.eventById.event),
      related: response.eventById.related ? new RelatedClass(response.eventById.related) : undefined,
      markers: response.eventById.markers ? new MarkersClass(response.eventById.markers) : undefined
    };
  }
}