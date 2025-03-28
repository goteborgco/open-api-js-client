import { Client } from './client/Client';
import { Guides } from './types/Guides';
import { Events } from './types/Events';
import { Places } from './types/Places';
import { Search } from './types/Search';
import { Taxonomies } from './types/Taxonomies';
import { Taxonomy } from './types/Taxonomy';

/**
 * Main API client class for interacting with the Göteborg & Co GraphQL API
 * 
 * This class provides access to all API endpoints through type-safe methods
 * and supports raw GraphQL queries for advanced use cases.
 */
export class GoteborgCoApi {
  private client: Client;
  private guidesInstance?: Guides;
  private eventsInstance?: Events;
  private placesInstance?: Places;
  private searchInstance?: Search;
  private taxonomiesInstance?: Taxonomies;
  private taxonomyInstance?: Taxonomy;

  /**
   * Initialize the API client
   * 
   * @param apiUrl The base URL for the GraphQL API
   * @param subscriptionKey Your API subscription key
   */
  constructor(apiUrl: string, subscriptionKey: string) {

    if (!apiUrl || !subscriptionKey) {
      throw new Error('API URL and subscription key are required');
    }

    this.client = new Client(apiUrl, subscriptionKey);
  }

  /**
   * Execute a raw GraphQL query
   * 
   * @param query The complete GraphQL query
   * @returns The query result
   * @throws Error If the query is empty or execution fails
   */
  async query<T = any>(query: string): Promise<T> {
    if (!query?.trim()) {
      throw new Error('Query cannot be empty');
    }
    return this.client.execute<T>(query);
  }

  /**
   * Get the Guides API for accessing guide content
   * 
   * @returns The Guides API instance
   */
  guides(): Guides {
    if (!this.guidesInstance) {
      this.guidesInstance = new Guides(this.client);
    }
    return this.guidesInstance;
  }

  /**
   * Get the Events API for accessing event content
   * 
   * @returns The Events API instance
   */
  events(): Events {
    if (!this.eventsInstance) {
      this.eventsInstance = new Events(this.client);
    }
    return this.eventsInstance;
  }

  /**
   * Get the Places API for accessing place content
   * 
   * @returns The Places API instance
   */
  places(): Places {
    if (!this.placesInstance) {
      this.placesInstance = new Places(this.client);
    }
    return this.placesInstance;
  }

  /**
   * Get the Search API for performing content searches
   * 
   * @returns The Search API instance
   */
  search(): Search {
    if (!this.searchInstance) {
      this.searchInstance = new Search(this.client);
    }
    return this.searchInstance;
  }

  /**
   * Get the Taxonomies API for listing available taxonomies
   * 
   * @returns The Taxonomies API instance
   */
  taxonomies(): Taxonomies {
    if (!this.taxonomiesInstance) {
      this.taxonomiesInstance = new Taxonomies(this.client);
    }
    return this.taxonomiesInstance;
  }

  /**
   * Get the Taxonomy API for querying specific taxonomies
   * 
   * @returns The Taxonomy API instance
   */
  taxonomy(): Taxonomy {
    if (!this.taxonomyInstance) {
      this.taxonomyInstance = new Taxonomy(this.client);
    }
    return this.taxonomyInstance;
  }
} 