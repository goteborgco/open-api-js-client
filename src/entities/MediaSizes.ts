import { Image } from './Image';

/**
 * Represents different sizes of a media item
 */
export class MediaSizes {
  readonly medium?: Image;
  readonly thumbnail?: Image;
  readonly large?: Image;
  readonly full?: Image;

  constructor(data: any) {
    this.medium = data.medium ? new Image(data.medium) : undefined;
    this.thumbnail = data.thumbnail ? new Image(data.thumbnail) : undefined;
    this.large = data.large ? new Image(data.large) : undefined;
    this.full = data.full ? new Image(data.full) : undefined;
  }

  /**
   * Get a specific size
   * @param size The size to get
   * @returns The image data for the requested size or undefined
   */
  getSize(size: 'full' | 'large' | 'medium' | 'thumbnail'): Image | undefined {
    return this[size];
  }

  /**
   * Get the URL for a specific size
   * @param size The size to get the URL for
   * @returns The URL for the requested size or undefined
   */
  getUrl(size: 'full' | 'large' | 'medium' | 'thumbnail'): string | undefined {
    return this[size]?.source_url;
  }

  /**
   * Get the dimensions for a specific size
   * @param size The size to get dimensions for
   * @returns The dimensions for the requested size or undefined
   */
  getDimensions(size: 'full' | 'large' | 'medium' | 'thumbnail'): { width: number; height: number } | undefined {
    const image = this[size];
    if (!image) return undefined;
    return {
      width: image.width,
      height: image.height
    };
  }
} 