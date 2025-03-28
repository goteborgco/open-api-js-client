import { Client } from '../client/Client';
import type { GuideFilter } from '../interfaces/common';
import { WpEntity as WpEntityClass } from '../entities/WpEntity';
import { Related as RelatedClass } from '../entities/Related';

export interface SingleGuideResponse {
  guide: WpEntityClass;
  related?: RelatedClass;
}

/**
 * Guides API for accessing guide content
 * 
 * This class provides type-safe methods for querying and retrieving guide content
 * from the GraphQL API.
 */
export class Guides {
  private readonly defaultGuideFields = `
    id
    title
    excerpt
    date
    categories
    areas
    tags
    category_heading
    dates {
      end
      start
    }
    featuredmedia {
      sizes {
        large {
          height
          source_url
          width
        }
      }
    }
    translations {
      en
      sv
    }
  `;

  constructor(private client: Client) {}

  /**
   * List guides with optional filtering
   * 
   * @param filter Optional filtering options
   * @param matchDate Optional matchDate
   * @param fields Optional GraphQL fields to return
   * @returns Array of guide entities
   */
  async list(
    filter: GuideFilter,
    matchDate?: string,
    fields?: string
  ): Promise<WpEntityClass[]> {
    const defaultFields = `
      guides {
        ${this.defaultGuideFields}
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
        guides(${filterArgs ? `filter: { ${filterArgs} }` : ''}${matchDate ? `, matchDate: "${matchDate}"` : ''}) {
          ${fields || defaultFields}
        }
      }
    `;

    const response = await this.client.execute<{ guides: { guides: any[] } }>(query);
    return response.guides.guides.map(guide => new WpEntityClass(guide));
  }

  /**
   * Get a specific guide by ID
   * 
   * @param id The guide ID
   * @param lang Language code ('en' or 'sv')
   * @param fields Optional GraphQL fields to return
   * @returns Guide entity with related content
   */
  async getById(
    id: number,
    lang: 'en' | 'sv',
    fields?: string
  ): Promise<SingleGuideResponse> {
    const defaultFields = `
      guide {
        ${this.defaultGuideFields}
      }
      related {
        events {
          ${this.defaultGuideFields}
        }
        guides {
          ${this.defaultGuideFields}
        }
        places {
          ${this.defaultGuideFields}
        }
      }
    `;

    const query = `
      query {
        guideById(filter: { id: ${id}, lang: ${lang} }) {
          ${fields || defaultFields}
        }
      }
    `;

    const response = await this.client.execute<{ guideById: { guide: any; related?: any } }>(query);
    return {
      guide: new WpEntityClass(response.guideById.guide),
      related: response.guideById.related ? new RelatedClass(response.guideById.related) : undefined
    };
  }
} 