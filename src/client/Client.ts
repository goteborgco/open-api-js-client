/**
 * HTTP client for making GraphQL API requests
 * 
 * This class handles the low-level HTTP communication with the GraphQL API,
 * including authentication, request formatting, and error handling.
 */
export class Client {
  private apiUrl: string;
  private subscriptionKey: string;

  /**
   * Initialize the HTTP client
   * 
   * @param apiUrl The base URL for the GraphQL API
   * @param subscriptionKey Your API subscription key
   */
  constructor(apiUrl: string, subscriptionKey: string) {
    this.apiUrl = apiUrl;
    this.subscriptionKey = subscriptionKey;
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
  async execute<T = any>(query: string): Promise<T> {
    try {
      const url = `${this.apiUrl}?subscription-key=${encodeURIComponent(this.subscriptionKey)}`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        const errorDetail = await response.json();
        const errorMessage = errorDetail.errors 
          ? JSON.stringify(errorDetail.errors)
          : await response.text();
          
        throw new Error(
          `HTTP request failed with status ${response.status}\n` +
          `Response: ${errorMessage}\n` +
          `Query: ${query}`
        );
      }

      const result = await response.json();

      if (result.errors) {
        throw new Error(
          `GraphQL errors: ${JSON.stringify(result.errors)}\n` +
          `Query: ${query}`
        );
      }

      return result.data as T;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`GraphQL query failed: ${error.message}`);
      }
      throw new Error('An unknown error occurred during the GraphQL query');
    }
  }
} 