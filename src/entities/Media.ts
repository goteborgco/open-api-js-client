import { MediaSizes } from './MediaSizes';

export class Media {
  readonly id: number;
  readonly credit?: string;
  readonly caption?: string;
  readonly alt_text?: string;
  readonly media_type?: string;
  readonly mime_type?: string;
  readonly sizes: MediaSizes;

  constructor(data: any) {
    this.id = data.id;
    this.credit = data.credit;
    this.caption = data.caption;
    this.alt_text = data.alt_text;
    this.media_type = data.media_type;
    this.mime_type = data.mime_type;
    this.sizes = new MediaSizes(data.sizes || {});
  }

  /**
   * Get the ID of the media
   * @returns The media ID
   */
  getId(): number {
    return this.id;
  }

  /**
   * Get the credit information
   * @returns The credit text or undefined
   */
  getCredit(): string | undefined {
    return this.credit;
  }

  /**
   * Get the caption text
   * @returns The caption text or undefined
   */
  getCaption(): string | undefined {
    return this.caption;
  }

  /**
   * Get the alternative text
   * @returns The alt text or undefined
   */
  getAltText(): string | undefined {
    return this.alt_text;
  }

  /**
   * Get the media type
   * @returns The media type or undefined
   */
  getMediaType(): string | undefined {
    return this.media_type;
  }

  /**
   * Get the MIME type
   * @returns The MIME type or undefined
   */
  getMimeType(): string | undefined {
    return this.mime_type;
  }

  /**
   * Get the sizes of the media
   * @returns The media sizes object
   */
  getSizes(): MediaSizes {
    return this.sizes;
  }

  /**
   * Get the URL for a specific size
   * @param size The desired size
   * @returns The URL for the requested size or undefined
   */
  getUrl(size: 'full' | 'large' | 'medium' | 'thumbnail' = 'full'): string | undefined {
    return this.sizes[size]?.source_url;
  }
} 