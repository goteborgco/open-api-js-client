/**
 * Properties for a map marker
 */
export class Properties {
  readonly name: string;
  readonly id: number;
  readonly icon: string;
  readonly thumbnail: string;
  readonly type: string;
  readonly slug: string;

  constructor(data: any) {
    this.name = data.name;
    this.id = data.id;
    this.icon = data.icon;
    this.thumbnail = data.thumbnail;
    this.type = data.type;
    this.slug = data.slug;
  }
}

/**
 * Geometry information for a map marker
 */
export class Geometry {
  readonly type: string;
  readonly coordinates: number[];

  constructor(data: any) {
    this.type = data.type;
    this.coordinates = data.coordinates;
  }
}

/**
 * A feature on the map
 */
export class Feature {
  readonly type: string;
  readonly geometry: Geometry;
  readonly properties: Properties;

  constructor(data: any) {
    this.type = data.type;
    this.geometry = new Geometry(data.geometry);
    this.properties = new Properties(data.properties);
  }
}

/**
 * Collection of map markers
 */
export class Markers {
  readonly type: string;
  readonly features: Feature[];

  constructor(data: any) {
    this.type = data.type;
    this.features = data.features?.map((f: any) => new Feature(f)) || [];
  }
} 