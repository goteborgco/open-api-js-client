import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client/core';
import { DocumentNode, parse } from 'graphql';
import fetch from 'cross-fetch';

/**
 * HTTP client for making GraphQL API requests
 * 
 * This class handles the low-level HTTP communication with the GraphQL API,
 * including authentication, request formatting, and error handling.
 */
export class Client {
  private client: ApolloClient<any>;

  /**
   * Initialize the HTTP client
   * 
   * @param apiUrl The base URL for the GraphQL API
   * @param subscriptionKey Your API subscription key
   */
  constructor(apiUrl: string, subscriptionKey: string) {
    const httpLink = createHttpLink({
      uri: apiUrl,
      fetch,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Ocp-Apim-Subscription-Key': subscriptionKey
      }
    });

    this.client = new ApolloClient({
      link: httpLink,
      cache: new InMemoryCache(),
    });
  }

  /**
   * Execute a GraphQL query
   *
   * @param query The GraphQL query to execute
   * @returns The query results from the 'data' field of the GraphQL response
   * @throws Error When:
   *               - JSON encoding/decoding fails
   *               - HTTP request fails (non-200 status)
   *               - GraphQL response contains errors
   *               - Network or other errors occur
   */
  async execute<T = any>(query: string | DocumentNode): Promise<T> {
    try {      
      const parsedQuery = typeof query === 'string' ? parse(query) : query;
      
      const { data, errors } = await this.client.query({
        query: parsedQuery,
      });

      if (errors?.length) {
        const errorMessages = errors.map(e => e.message).join(', ');
        throw new Error(
          `GraphQL errors: ${errorMessages}\n` +
          `Query: ${typeof query === 'string' ? query : query.loc?.source.body}`
        );
      }

      if (!data) {
        throw new Error('No data returned from the GraphQL query');
      }

      return data as T;
    } catch (error: any) {
      if (error.networkError) {
        throw new Error(`Network error: ${error.networkError.message || 'Connection failed'}`);
      }
      if (error instanceof Error) {
        throw new Error(`GraphQL query failed: ${error.message}`);
      }
      throw new Error('An unknown error occurred during the GraphQL query');
    }
  }
}