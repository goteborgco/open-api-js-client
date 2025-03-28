export class Contact {
  readonly email?: string;
  readonly phone?: string;
  readonly website?: string;
  readonly facebook?: string;
  readonly instagram?: string;

  constructor(data: any) {
    this.email = data.email;
    this.phone = data.phone;
    this.website = data.website;
    this.facebook = data.facebook;
    this.instagram = data.instagram;
  }

  /**
   * Get social media links
   * @returns Object containing social media links
   */
  getSocialLinks(): { facebook?: string; instagram?: string } {
    return {
      facebook: this.facebook,
      instagram: this.instagram
    };
  }

  /**
   * Get contact methods
   * @returns Object containing contact methods
   */
  getContactMethods(): { email?: string; phone?: string; website?: string } {
    return {
      email: this.email,
      phone: this.phone,
      website: this.website
    };
  }

  /**
   * Check if any contact information exists
   * @returns boolean indicating if any contact information is available
   */
  hasContactInfo(): boolean {
    return Boolean(
      this.email ||
      this.phone ||
      this.website ||
      this.facebook ||
      this.instagram
    );
  }
} 