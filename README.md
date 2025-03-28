# Göteborg & Co API Client for JavaScript/TypeScript

Official JavaScript/TypeScript client library for interacting with the Göteborg & Co GraphQL API. This package provides a type-safe interface for accessing Göteborg & Co's API, offering both structured methods for common operations and flexible GraphQL query capabilities.

## Features

- Type-safe methods for common operations (guides, events, places, search and taxonomies)
- Direct GraphQL query support for advanced use cases
- Built-in error handling and response parsing
- Full TypeScript support with type definitions
- Comprehensive documentation and examples

## Requirements

- Node.js >= 18.0.0
- npm or yarn package manager

## Installation

Install the package via npm:

```bash
npm install @goteborgco/open-api-js-client
```

Or using yarn:

```bash
yarn add @goteborgco/open-api-js-client
```

## Setup

Initialize the API Client with your API URL and subscription key:

```typescript
import { GoteborgCoApi } from '@goteborgco/open-api-js-client';

const apiUrl = 'https://apim-openapi-gbgco-prod.azure-api.net/gql';
const subscriptionKey = 'your-subscription-key';

const api = new GoteborgCoApi(apiUrl, subscriptionKey);
```

## Usage

### Type-Specific Methods

While the general query method provides full flexibility, the API includes type-specific methods for common operations. These methods provide:
- Full TypeScript type safety
- Simpler parameter handling
- Structured field selection
- Default values for common use cases
- IDE autocompletion support

Each method supports custom field selection through GraphQL. If no fields are specified, carefully chosen default fields will be used that cover most common use cases.

### Guides

The API provides methods to list guides and retrieve individual guides by ID.

#### Methods

##### list(filter, matchDate?, fields?)
Lists guides based on provided filters.

Parameters:
- `filter: GuideFilter`
  - `lang: 'en' | 'sv'` - Content language (required)
  - `categories?: number[]` - Filter by category IDs
  - `areas?: number[]` - Filter by area IDs
  - `tags?: number[]` - Filter by tag IDs
  - `invisible_tags?: number[]` - Filter by invisible tag IDs
  - `per_page?: number` - Results per page (only works together with page)
  - `page?: number` - Page number
- `matchDate?: string` - Optional date to match guides against (ISO 8601)
- `fields?: string | object` - Custom field selection

##### getById(id, lang, fields?)
Retrieves a single guide by ID.

Parameters:
- `id: number` - Guide ID
- `lang: 'en' | 'sv'` - Content language
- `fields?: string | object` - Custom field selection

```typescript
// List guides with filters
const guides = await api.guides().list({
  lang: 'sv',
  categories: [10],
  areas: [20],
  per_page: 5,
  page: 1
});

// Custom field selection
const customFields = `
  id
  title
  excerpt
  featuredmedia {
    sizes {
      full {
        source_url
      }
    }
  }
`;

const guidesWithCustomFields = await api.guides().list({
  lang: 'sv'
}, undefined, customFields);

// Get single guide
const guide = await api.guides().getById(8337, 'sv');
```

### Events

The API provides methods to list events and retrieve individual events by ID. Events include support for date filtering, location-based filtering, and sorting.

#### Methods

##### list(filter, sortBy?, fields?)
Lists events based on provided filters.

Parameters:
- `filter: EventFilter`
  - `lang: 'en' | 'sv'` - Content language (required)
  - `places?: number[]` - Filter by specific place IDs
  - `categories?: number[]` - Filter by category IDs
  - `areas?: number[]` - Filter by area IDs
  - `tags?: number[]` - Filter by tag IDs
  - `invisible_tags?: number[]` - Filter by invisible tag IDs
  - `free?: number` - Filter by free admission
  - `start?: string` - Start date (ISO 8601, use together with end)
  - `end?: string` - End date (ISO 8601, use together with start)
  - `distance?: number` - Filter by distance in kilometers from coords
  - `coords?: string` - Coordinates to calculate distance from (format: "longitude,latitude")
  - `per_page?: number` - Results per page (only works together with page)
  - `page?: number` - Page number
- `sortBy?: SortOptions`
  - `fields?: string[]` - Fields to order by
  - `orders?: ('asc' | 'desc')[]` - Order direction for each field
- `fields?: string | object` - Custom field selection

##### getById(id, lang, fields?)
Retrieves a single event by ID.

Parameters:
- `id: number` - Event ID
- `lang: 'en' | 'sv'` - Content language
- `fields?: string | object` - Custom field selection

```typescript
// List events with date filters
const events = await api.events().list({
  lang: 'sv',
  categories: [10],
  start: '2024-01-01',
  end: '2024-12-31'
});

// List events with location filter
const nearbyEvents = await api.events().list({
  lang: 'sv',
  coords: '11.9746,57.7089', // Note: longitude comes first
  distance: 2 // 2km radius
});

// List events with sorting
const sortedEvents = await api.events().list({
  lang: 'sv',
  free: 1
}, {
  fields: ['date'],
  orders: ['desc']
});

// Custom field selection
const customFields = `
  id
  title
  dates {
    start
    end
  }
  location {
    address
    lat
    lng
  }
`;

const eventsWithCustomFields = await api.events().list({
  lang: 'sv',
  categories: [10]
}, undefined, customFields);
```

### Places

The API provides methods to list places and retrieve individual places by ID.

#### Methods

##### list(filter, fields?)
Lists places based on provided filters.

Parameters:
- `filter: PlaceFilter`
  - `lang: 'en' | 'sv'` - Content language (required)
  - `places?: number[]` - Filter by specific place IDs
  - `categories?: number[]` - Filter by category IDs
  - `areas?: number[]` - Filter by area IDs
  - `tags?: number[]` - Filter by tag IDs
  - `distance?: number` - Filter by distance in kilometers
  - `coords?: string` - Coordinates to calculate distance from (format: "lat,lng")
  - `per_page?: number` - Results per page (only works together with page)
  - `page?: number` - Page number
- `fields?: string | object` - Custom field selection

##### getById(id, lang, fields?)
Retrieves a single place by ID.

Parameters:
- `id: number` - Place ID
- `lang: 'en' | 'sv'` - Content language
- `fields?: string | object` - Custom field selection

```typescript
// List places with filters
const places = await api.places().list({
  lang: 'sv',
  categories: [10],
  areas: [20],
  per_page: 10,
  page: 1
});

// Custom field selection
const customFields = `
  id
  title
  excerpt
  location {
    address
    lat
    lng
    name
  }
  contact {
    email
    website
  }
`;

const placesWithCustomFields = await api.places().list({
  lang: 'sv',
  categories: [10]
}, customFields);
```

### Search

The API provides methods for searching across all content types.

#### Methods

##### query(filter, options?, fields?)
Searches across all content types.

Parameters:
- `filter: SearchFilter`
  - `query: string` - Search term
  - `lang: 'en' | 'sv'` - Content language
- `sortBy?: SortOptions`
  - `fields?: string[]` - Fields to order by
  - `orders?: ('asc' | 'desc')[]` - Order direction for each field
- `fields?: string | object` - Custom field selection

```typescript
// Search with default fields
const results = await api.search().query({
  query: 'Fika',
  lang: 'sv'
});

// Custom field selection
const customFields = `
  id
  title
  excerpt
  featuredmedia {
    sizes {
      medium {
        source_url
      }
    }
  }
`;

const resultsWithCustomFields = await api.search().query({
  query: 'Fika',
  lang: 'sv'
}, undefined, customFields);
```

### Taxonomies

The API provides methods to list available taxonomies and their terms.

#### Methods

##### list(filter, fields?)
Lists all available taxonomies.

Parameters:
- `filter: LangFilter`
  - `lang: 'en' | 'sv'` - Content language
- `fields?: string | object` - Custom field selection

```typescript
// List taxonomies
const taxonomies = await api.taxonomies().list({
  lang: 'sv'
});

// Custom field selection
const customFields = `
  name
  description
`;

const taxonomiesWithCustomFields = await api.taxonomies().list({
  lang: 'sv'
}, customFields);
```

### Taxonomy Terms

The API provides methods to list terms within a specific taxonomy.

#### Methods

##### list(taxonomy, filter, fields?, hierarchical?)
Lists terms within a taxonomy.

Parameters:
- `taxonomy: string` - Taxonomy identifier (e.g., 'categories', 'areas', 'tags')
- `filter: LangFilter`
  - `lang: 'en' | 'sv'` - Content language
- `fields?: string | object` - Custom field selection
- `hierarchical?: boolean` - Whether to return terms in a hierarchical structure (default: false)

```typescript
// List terms (flat)
const terms = await api.taxonomy().list('categories', { lang: 'sv' });

// Custom field selection
const customFields = `
  id
  name
  count
`;

const termsWithCustomFields = await api.taxonomy().list('categories', { lang: 'sv' }, customFields);

// Hierarchical structure
const tree = await api.taxonomy().list('categories', { lang: 'sv' }, undefined, true);
```

### Error Handling

The API uses promise-based error handling. Wrap your API calls in try-catch blocks:

```typescript
try {
  const guides = await api.guides().list({ lang: 'sv' });
} catch (error) {
  if (error instanceof Error) {
    console.error('API Error:', error.message);
  }
}
```

## Available Entities

The API uses several entity classes to represent different types of data. Here's a comprehensive list of all available entities and their properties/methods:

### WpEntity
Base entity for all WordPress content (guides, events, places)

Properties:
- `id: number` - Unique identifier
- `title: string` - Content title
- `excerpt: string` - Short description
- `content?: string` - Full content (HTML)
- `date: string` - Creation date (ISO 8601)
- `modified?: string` - Last modification date
- `link?: string` - Public URL
- `categories: number[]` - Category IDs
- `areas: number[]` - Area IDs
- `tags: number[]` - Tag IDs
- `category_heading?: string` - Optional category heading
- `lang: 'en' | 'sv'` - Content language
- `place_id?: number` - Associated place ID
- `is_free?: boolean`