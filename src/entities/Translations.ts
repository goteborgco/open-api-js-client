export class Translations {
  readonly sv?: number;
  readonly en?: number;

  constructor(data: any) {
    this.sv = data.sv;
    this.en = data.en;
  }

  /**
   * Get translation ID for a specific language
   * @param lang Language code
   * @returns Translation ID or undefined if not available
   */
  getTranslation(lang: 'en' | 'sv'): number | undefined {
    return this[lang];
  }

  /**
   * Check if a translation exists for a language
   * @param lang Language code
   * @returns Whether a translation exists
   */
  hasTranslation(lang: 'en' | 'sv'): boolean {
    return this[lang] !== undefined;
  }

  /**
   * Get all available translations
   * @returns Object containing all available translations
   */
  getAvailableTranslations(): { lang: 'en' | 'sv'; id: number }[] {
    const translations: { lang: 'en' | 'sv'; id: number }[] = [];
    if (this.sv) translations.push({ lang: 'sv', id: this.sv });
    if (this.en) translations.push({ lang: 'en', id: this.en });
    return translations;
  }
} 