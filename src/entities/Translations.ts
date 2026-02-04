export class Translations {
  readonly sv?: number;
  readonly en?: number;
  readonly de?: number;

  constructor(data: any) {
    this.sv = data.sv;
    this.en = data.en;
    this.de = data.de;
  }

  /**
   * Get translation ID for a specific language
   * @param lang Language code
   * @returns Translation ID or undefined if not available
   */
  getTranslation(lang: 'en' | 'sv' | 'de'): number | undefined {
    return this[lang];
  }

  /**
   * Check if a translation exists for a language
   * @param lang Language code
   * @returns Whether a translation exists
   */
  hasTranslation(lang: 'en' | 'sv' | 'de'): boolean {
    return this[lang] !== undefined;
  }

  /**
   * Get all available translations
   * @returns Object containing all available translations
   */
  getAvailableTranslations(): { lang: 'en' | 'sv' | 'de'; id: number }[] {
    const translations: { lang: 'en' | 'sv' | 'de'; id: number }[] = [];
    if (this.sv) translations.push({ lang: 'sv', id: this.sv });
    if (this.en) translations.push({ lang: 'en', id: this.en });
    if (this.de) translations.push({ lang: 'de', id: this.de });
    return translations;
  }
} 