/**
 * Simple template literal tag function for GraphQL queries
 * Allows for cleaner GraphQL query syntax with template literals
 */
export const gql = (strings: TemplateStringsArray, ...values: any[]) => 
  strings.reduce((result, str, i) => result + str + (values[i] || ''), ''); 