/**
 * Represents a taxonomy type in the system
 */
export class Taxonomy {
  readonly name: string;
  readonly description: string;
  readonly value: string;
  readonly types: string[];

  constructor(data: any) {
    this.name = data.name;
    this.description = data.description;
    this.value = data.value;
    this.types = data.types || [];
  }

  /**
   * Get the list of content types this taxonomy is available for
   */
  getTypes(): string[] {
    return [...this.types];
  }

  /**
   * Check if this taxonomy is available for a specific content type
   */
  isAvailableFor(type: string): boolean {
    return this.types.includes(type);
  }
} 