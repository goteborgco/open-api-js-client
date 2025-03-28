export class EventDate {
  readonly start?: string;
  readonly end?: string;

  constructor(data: any) {
    this.start = data.start;
    this.end = data.end;
  }

  /**
   * Check if the date range is currently active
   * @returns boolean indicating if the current date is within the range
   */
  isActive(): boolean {
    const now = new Date();
    const start = this.start ? new Date(this.start) : null;
    const end = this.end ? new Date(this.end) : null;
    
    return (!start || start <= now) && (!end || end >= now);
  }

  /**
   * Get formatted date range string
   * @returns Formatted date range or undefined if no dates exist
   */
  getFormattedRange(): string | undefined {
    if (!this.start && !this.end) return undefined;
    
    const start = this.start ? new Date(this.start).toLocaleDateString() : undefined;
    const end = this.end ? new Date(this.end).toLocaleDateString() : undefined;
    
    if (start && end) {
      return `${start} - ${end}`;
    }
    return start || end;
  }
} 