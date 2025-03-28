import { Client } from '../client/Client';
import type { SearchFilter, SortOptions } from '../interfaces/common';
import { WpEntity as WpEntityClass } from '../entities/WpEntity';

/**
 * Search API for searching content across all types
 * 
 * This class provides type-safe methods for searching content from the GraphQL API.
 * Search results include content from places, events, guides, and other searchable content types.
 */
export class Search {
  private readonly defaultSearchFields = `
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
    translations {
      en
      sv
    }
  `;

  constructor(private client: Client) {}

  /**
   * Search content with optional filtering and sorting
   * 
   * @param filter Search filter including query and optional filters:
   *               - query: string (required) - The search query text
   *               - lang: 'en' | 'sv' - Language filter
   * @param sort Optional sorting options:
   *            - fields: string[] | string - Fields to sort by
   *            - orders: ('asc' | 'desc')[] | 'asc' | 'desc' - Sort direction(s)
   * @param fields Optional GraphQL fields to return
   * @returns Array of matching content entities
   * @throws Error if search query is empty
   */
  async query(
    filter: SearchFilter,
    sort?: SortOptions,
    fields?: string
  ): Promise<WpEntityClass[]> {
    if (!filter.query) {
      throw new Error('Search query cannot be empty');
    }

    if (filter.lang && !['en', 'sv'].includes(filter.lang)) {
      throw new Error('Language must be either "en" or "sv"');
    }

    const defaultFields = `
      results {
        ${this.defaultSearchFields}
      }
    `;

    // Convert filter object to GraphQL arguments format
    const filterArgs = Object.entries(filter)
      .map(([key, value]) => {
        if (key === 'lang') {
          return `${key}: ${value}`; // Language is an enum, don't quote it
        }
        if (Array.isArray(value)) {
          return `${key}: [${value.join(', ')}]`;
        }
        if (typeof value === 'string') {
          return `${key}: "${value}"`;
        }
        return `${key}: ${value}`;
      })
      .join(', ');

    // Convert sort object to GraphQL arguments format if provided
    const sortArgs = sort ? Object.entries(sort)
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

    const query = `
      query {
        search(${filterArgs ? `filter: { ${filterArgs} }` : ''}${sortArgs ? `, sortBy: { ${sortArgs} }` : ''}) {
          ${fields || defaultFields}
        }
      }
    `;

    const response = await this.client.execute<{ search: { results: any[] } }>(query);
    return response.search.results.map(result => new WpEntityClass(result));
  }
} 