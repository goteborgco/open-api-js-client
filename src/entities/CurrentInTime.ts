export class CurrentInTime {
  readonly months: number[];
  readonly weekdays: number[];

  constructor(data: any) {
    // Convert string months to numbers if needed
    this.months = Array.isArray(data.months) 
      ? data.months.map((m: string | number) => typeof m === 'string' ? parseInt(m, 10) : m)
      : [];
    
    // Convert string weekdays to numbers if needed
    this.weekdays = Array.isArray(data.weekdays)
      ? data.weekdays.map((w: string | number) => typeof w === 'string' ? parseInt(w, 10) : w)
      : [];
  }

  /**
   * Check if a specific month is included
   * @param month Month number (1-12)
   * @returns boolean indicating if the month is included
   */
  hasMonth(month: number): boolean {
    return this.months.includes(month);
  }

  /**
   * Check if a specific weekday is included
   * @param weekday Weekday number (0-6, where 0 is Sunday)
   * @returns boolean indicating if the weekday is included
   */
  hasWeekday(weekday: number): boolean {
    return this.weekdays.includes(weekday);
  }

  /**
   * Check if current date matches the time pattern
   * @returns boolean indicating if current date matches
   */
  isCurrentlyActive(): boolean {
    const now = new Date();
    const currentMonth = now.getMonth() + 1; // getMonth() returns 0-11
    const currentWeekday = now.getDay(); // getDay() returns 0-6
    
    const monthMatch = !this.months.length || this.hasMonth(currentMonth);
    const weekdayMatch = !this.weekdays.length || this.hasWeekday(currentWeekday);
    
    return monthMatch && weekdayMatch;
  }

  /**
   * Get formatted schedule string
   * @returns Formatted schedule string or undefined if no schedule exists
   */
  getFormattedSchedule(): string | undefined {
    const parts: string[] = [];
    
    if (this.months.length) {
      const monthNames = this.months.map(m => new Date(2024, m - 1).toLocaleString('en-US', { month: 'long' }));
      parts.push(`Months: ${monthNames.join(', ')}`);
    }
    
    if (this.weekdays.length) {
      const weekdayNames = this.weekdays.map(w => new Date(2024, 0, w + 7).toLocaleString('en-US', { weekday: 'long' }));
      parts.push(`Days: ${weekdayNames.join(', ')}`);
    }
    
    return parts.length > 0 ? parts.join(' | ') : undefined;
  }
} 