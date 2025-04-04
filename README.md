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
  link
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
  link
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
  link
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
  link
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
- `featuredmedia?: Media[]` - Featured media items
- `gallery?: Media[]` - Gallery media items
- `location?: Location` - Location information
- `dates?: EventDate[]` - Event dates
- `contact?: Contact` - Contact information
- `current_in_time?: CurrentInTime` - Temporal availability
- `translations?: Translations` - Available translations
- `place_id?: number` - Associated place ID
- `is_free?: boolean` - Whether the content is free
- `lang: 'en' | 'sv'` - Content language

Methods:
- `getFeaturedMedia(): Media | undefined` - Get featured media if available
- `getImageUrl(size?: 'full' | 'large' | 'medium' | 'thumbnail'): string | undefined` - Get main image URL
- `getGalleryUrls(size?: 'full' | 'large' | 'medium' | 'thumbnail'): string[]` - Get all gallery image URLs
- `isActive(): boolean` - Check if entity is currently active
- `getCoordinates(): { lat: number; lng: number } | undefined` - Get location coordinates
- `getFormattedAddress(): string | undefined` - Get formatted address
- `getContact(): Contact | undefined` - Get contact information
- `getTranslation(lang: 'en' | 'sv'): number | undefined` - Get translation ID for language
- `getCurrentInTime(): CurrentInTime | undefined` - Get temporal availability info

### Location
Represents a physical location

Properties:
- `address?: string` - Street address
- `lat?: number` - Latitude
- `lng?: number` - Longitude
- `zoom?: number` - Map zoom level
- `place_id?: string` - Place identifier
- `name?: string` - Location name
- `street_number?: string` - Street number
- `street_name?: string` - Street name
- `state?: string` - State/region
- `post_code?: string` - Postal code
- `country?: string` - Country name
- `country_short?: string` - Country code

Methods:
- `getCoordinates(): { lat: number; lng: number } | undefined` - Get coordinates
- `getFormattedAddress(): string | undefined` - Get full formatted address
- `getShortAddress(): string | undefined` - Get short address (street and number)

### Contact
Represents contact information

Properties:
- `email?: string` - Email address
- `phone?: string` - Phone number
- `website?: string` - Website URL
- `facebook?: string` - Facebook URL
- `instagram?: string` - Instagram URL

Methods:
- `getSocialLinks(): { facebook?: string; instagram?: string }` - Get social media links
- `getContactMethods(): { email?: string; phone?: string; website?: string }` - Get contact methods
- `hasContactInfo(): boolean` - Check if any contact info exists

### Media
Represents media items (images, files)

Properties:
- `id: number` - Media ID
- `title: string` - Media title
- `caption?: string` - Media caption
- `credit?: string` - Media credit
- `alt_text?: string` - Alt text
- `media_type?: string` - Media type
- `mime_type?: string` - MIME type
- `sizes: MediaSizes` - Available size versions

Methods:
- `getId(): number` - Get media ID
- `getCredit(): string | undefined` - Get credit information
- `getCaption(): string | undefined` - Get caption text
- `getAltText(): string | undefined` - Get alt text
- `getMediaType(): string | undefined` - Get media type
- `getMimeType(): string | undefined` - Get MIME type
- `getSizes(): MediaSizes` - Get all size versions
- `getUrl(size?: 'full' | 'large' | 'medium' | 'thumbnail'): string | undefined` - Get URL for size

### MediaSizes
Collection of media size versions

Properties:
- `thumbnail?: Image` - Thumbnail version
- `medium?: Image` - Medium version
- `large?: Image` - Large version
- `full?: Image` - Full size version

Methods:
- `getSize(size: 'full' | 'large' | 'medium' | 'thumbnail'): Image | undefined` - Get specific size
- `getUrl(size: 'full' | 'large' | 'medium' | 'thumbnail'): string | undefined` - Get URL for size
- `getDimensions(size: 'full' | 'large' | 'medium' | 'thumbnail'): { width: number; height: number } | undefined` - Get dimensions

### Image
Represents an image file

Properties:
- `width: number` - Image width
- `height: number` - Image height
- `source_url: string` - Image URL
- `mime_type: string` - MIME type

### EventDate
Represents a date range for events

Properties:
- `start?: string` - Start date (ISO 8601)
- `end?: string` - End date (ISO 8601)

Methods:
- `isActive(): boolean` - Check if date range is currently active
- `getFormattedRange(): string | undefined` - Get formatted date range string

### CurrentInTime
Represents temporal availability (when content is active/available)

Properties:
- `months: number[]` - Active months (1-12)
- `weekdays: number[]` - Active weekdays (0-6, where 0 is Sunday)

Methods:
- `hasMonth(month: number): boolean` - Check if specific month is included
- `hasWeekday(weekday: number): boolean` - Check if specific weekday is included
- `isCurrentlyActive(): boolean` - Check if current date matches the time pattern
- `getFormattedSchedule(): string | undefined` - Get human-readable schedule (e.g. "Months: January, February | Days: Monday, Tuesday")

### Related
Collection of related content

Properties:
- `places?: WpEntity[]` - Related places
- `guides?: WpEntity[]` - Related guides
- `events?: WpEntity[]` - Related events

Methods:
- `getPlaces(): WpEntity[] | undefined` - Get related places
- `getGuides(): WpEntity[] | undefined` - Get related guides
- `getEvents(): WpEntity[] | undefined` - Get related events
- `getAllRelated(): { places?: WpEntity[]; guides?: WpEntity[]; events?: WpEntity[] }` - Get all related content
- `hasRelatedContent(): boolean` - Check if any related content exists

### Translations
Manages content translations

Properties:
- `sv?: number` - Swedish version ID
- `en?: number` - English version ID

Methods:
- `getTranslation(lang: 'en' | 'sv'): number | undefined` - Get translation ID for language
- `hasTranslation(lang: 'en' | 'sv'): boolean` - Check if translation exists
- `getAvailableTranslations(): { lang: 'en' | 'sv'; id: number }[]` - Get all translations

### TaxonomyTerm
Represents a term in a taxonomy

Properties:
- `id: number` - Term ID
- `name: string` - Term name
- `count: number` - Usage count
- `description: string` - Term description
- `parent?: number` - Parent term ID
- `children: TaxonomyTerm[]` - Child terms

Methods:
- `hasParent(): boolean` - Check if term has parent
- `getParentId(): number | undefined` - Get parent term ID
- `hasChildren(): boolean` - Check if term has children
- `getChildren(): TaxonomyTerm[]` - Get child terms
- `getChildCount(): number` - Get number of direct children
- `getAllDescendants(): TaxonomyTerm[]` - Get all descendant terms

### Taxonomy
Represents a taxonomy type

Properties:
- `name: string` - Taxonomy name
- `description: string` - Taxonomy description
- `value: string` - Taxonomy identifier
- `types: string[]` - Content types this taxonomy is available for

Methods:
- `getTypes(): string[]` - Get available content types
- `isAvailableFor(type: string): boolean` - Check if available for content type

### Properties (Map Marker)
Properties for a map marker

Properties:
- `name: string` - Marker name
- `id: number` - Marker ID
- `icon: string` - Marker icon
- `thumbnail: string` - Marker thumbnail
- `type: string` - Marker type
- `slug: string` - Marker slug

### Geometry
Geometry information for a map marker

Properties:
- `type: string` - Geometry type
- `coordinates: number[]` - Coordinates array

### Feature
A feature on the map

Properties:
- `type: string` - Feature type
- `geometry: Geometry` - Geometry information
- `properties: Properties` - Marker properties

### Markers
Collection of map markers

Properties:
- `type: string` - Collection type
- `features: Feature[]` - Map features

## Advanced Usage

### Raw GraphQL Queries

While the type-specific methods cover most common use cases, you can also execute raw GraphQL queries for advanced use cases:

```typescript
const query = `
    query {
        guides(filter: { lang: "sv" }) {
            guides {
                areas
                categories
                category_heading
                content
                date
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
                invisible_tags
                modified
                tags
                title
                translations {
                    en
                    sv
                }
            }
        }
    }
`;

try {
  const result = await api.query(query);
  console.log(result);
} catch (error) {
  console.error('GraphQL Error:', error);
}
```

This gives you full control over the query structure and allows you to:
- Access fields not exposed through the type-specific methods
- Combine multiple queries into a single request
- Use GraphQL features like fragments and variables
- Create complex nested queries
- Access custom fields and relationships