/**
 * Represents an image with dimensions and source URL
 */
export class Image {
  readonly width: number;
  readonly height: number;
  readonly source_url: string;

  constructor(data: any) {
    this.width = data.width;
    this.height = data.height;
    this.source_url = data.source_url;
  }
} 