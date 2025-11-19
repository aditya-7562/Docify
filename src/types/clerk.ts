/**
 * Type definitions for Clerk session claims and authentication
 */

export interface ClerkOrganization {
  id: string;
  name?: string;
  slug?: string;
  role?: string;
}

export interface ClerkSessionClaims {
  /**
   * Organization information
   * Clerk stores org data under 'o' key
   */
  o?: {
    id: string;
    name?: string;
    slug?: string;
    role?: string;
  };
  /**
   * Legacy organization ID (deprecated, use 'o.id' instead)
   */
  org_id?: string;
  /**
   * User ID
   */
  sub: string;
  /**
   * Session ID
   */
  sid: string;
  /**
   * Email address
   */
  email?: string;
  /**
   * Email verified status
   */
  email_verified?: boolean;
  /**
   * Other custom claims
   */
  [key: string]: unknown;
}

export interface ClerkUser {
  id: string;
  fullName?: string | null;
  primaryEmailAddress?: {
    emailAddress: string;
  } | null;
  imageUrl?: string | null;
  organizationId?: string | null;
}

