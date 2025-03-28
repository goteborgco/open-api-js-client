import { Client } from '../client/Client';
import type { LangFilter } from '../interfaces/common';
import { Taxonomy as TaxonomiesClass } from '../entities/Taxonomy';

export interface TaxonomyInfo {
  name: string;
  description: string;
  value: string;
  types: string[];
}

/**
 * Taxonomies API for listing available taxonomies
 * 
 * This class provides type-safe methods for getting an overview of all taxonomy types
 * in the system.
 */
export class Taxonomies {
  constructor(private client: Client) {}

  /**
   * List all available taxonomies
   * 
   * @param filter Optional filtering options:
   *              - lang: 'en' | 'sv' - Language filter (enum)
   * @param fields Optional GraphQL fields to return
   * @returns Array of taxonomy information
   */
  async list(
    filter: LangFilter = {},
    fields?: string
  ): Promise<TaxonomiesClass[]> {
    const defaultFields = `
      name
      description
      value
      types
    `;

    // Handle lang as an enum value (unquoted)
    const filterStr = filter.lang ? `{ lang: ${filter.lang} }` : '{}';

    const query = `
      query {
        taxonomies(filter: ${filterStr}) {
          ${fields || defaultFields}
        }
      }
    `;

    const response = await this.client.execute<{ taxonomies: any[] }>(query);
    return response.taxonomies.map(taxonomy => new TaxonomiesClass(taxonomy));
  }
} 