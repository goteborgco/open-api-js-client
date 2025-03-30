import { Client } from '../client/Client';
import type { LangFilter } from '../interfaces/common';
import { TaxonomyTerm } from '../entities/TaxonomyTerm';
import { gql } from '../utils/gql';

/**
 * Taxonomy API for querying specific taxonomies
 * 
 * This class provides type-safe methods for listing all terms within a specific taxonomy,
 * either as a flat list or as a hierarchical tree structure.
 */
export class Taxonomy {
  constructor(private client: Client) {}

  /**
   * List terms within a specific taxonomy
   * 
   * @param taxonomyName The name of the taxonomy to query
   * @param filter Optional filtering options:
   *              - lang: 'en' | 'sv' - Language filter (enum)
   * @param fields Optional GraphQL fields to return
   * @param hierarchical Whether to return terms in a tree structure
   * @returns Array of taxonomy terms, optionally in a hierarchical structure
   */
  async list(
    taxonomyName: string,
    filter: LangFilter = {},
    fields?: string,
    hierarchical: boolean = false
  ): Promise<TaxonomyTerm[]> {
    const defaultFields = `
      id
      name
      count
      description
      parent
    `;

    // Handle lang as an enum value (unquoted)
    const filterStr = filter.lang ? `{ lang: ${filter.lang} }` : '{}';

    const query = gql`
      query GetTaxonomyTerms {
        taxonomy(
          taxonomyName: "${taxonomyName}",
          filter: ${filterStr}
        ) {
          ${fields || defaultFields}
        }
      }
    `;

    const terms = await this.client.execute<{ taxonomy: any[] }>(query)
      .then(data => data.taxonomy.map(term => new TaxonomyTerm(term)));

    if (!hierarchical) {
      return terms;
    }

    return this.buildHierarchy(terms);
  }

  /**
   * Build a hierarchical structure from flat taxonomy terms
   * 
   * @param terms Array of taxonomy terms
   * @returns Array of root taxonomy terms with populated children
   */
  private buildHierarchy(terms: TaxonomyTerm[]): TaxonomyTerm[] {
    const termMap = new Map<number, any>();
    const rootTerms: any[] = [];

    // First pass: create term data objects
    terms.forEach(term => {
      termMap.set(term.id, {
        ...term,
        children: []
      });
    });

    // Second pass: build the hierarchy
    terms.forEach(term => {
      const termData = termMap.get(term.id);
      
      if (term.hasParent() && termMap.has(term.getParentId()!)) {
        // Add to parent's children
        termMap.get(term.getParentId()!)!.children.push(termData);
      } else {
        // Add to root terms
        rootTerms.push(termData);
      }
    });

    // Create new Taxonomy instances with the hierarchical structure
    return rootTerms.map(termData => new TaxonomyTerm(termData));
  }
} 