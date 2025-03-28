import { Taxonomy } from "../types/Taxonomy";

/**
 * Represents a single term within a taxonomy
 */
export class TaxonomyTerm {
  readonly id: number;
  readonly name: string;
  readonly count: number;
  readonly description: string;
  readonly parent?: number;
  readonly children: TaxonomyTerm[] = [];

  constructor(data: any) {
    this.id = data.id;
    this.name = data.name;
    this.count = data.count;
    this.description = data.description;
    this.parent = data.parent;
    this.children = data.children?.map((child: any) => new TaxonomyTerm(child)) || [];
  }

  /**
   * Check if this term has a parent
   */
  hasParent(): boolean {
    return this.parent !== undefined && this.parent !== null;
  }

  /**
   * Get the parent ID if it exists
   */
  getParentId(): number | undefined {
    return this.parent;
  }

  /**
   * Check if this term has children
   */
  hasChildren(): boolean {
    return this.children.length > 0;
  }

  /**
   * Get all children of this term
   */
  getChildren(): TaxonomyTerm[] {
    return [...this.children];
  }

  /**
   * Get the number of direct children
   */
  getChildCount(): number {
    return this.children.length;
  }

  /**
   * Get all descendant terms (children, grandchildren, etc.)
   */
  getAllDescendants(): TaxonomyTerm[] {
    const descendants: TaxonomyTerm[] = [];
    const stack = [...this.children];

    while (stack.length > 0) {
      const current = stack.pop()!;
      descendants.push(current);
      stack.push(...current.children);
    }

    return descendants;
  }
} 