/**
 * API Constants - Centralized API endpoint definitions
 * Prevents hardcoded strings and makes maintenance easier
 */

export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    REGISTER: "/auth/register",
    LOGIN: "/auth/login",
    PROFILE: "/auth/profile",
    CHANGE_PASSWORD: "/auth/change-password",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
  },

  // Properties
  PROPERTIES: {
    LIST: "/properties",
    DETAIL: (id) => `/properties/${id}`,
    REVIEWS: (id) => `/properties/${id}/reviews`,
    INQUIRE: (id) => `/properties/${id}/inquire`,
    CREATE: "/properties",
    UPDATE: (id) => `/properties/${id}`,
    DELETE: (id) => `/properties/${id}`,
    IMAGES: (id) => `/properties/${id}/images`,
  },

  // Services
  SERVICES: {
    LIST: "/services",
    DETAIL: (id) => `/services/${id}`,
    CREATE: "/services",
    UPDATE: (id) => `/services/${id}`,
    DELETE: (id) => `/services/${id}`,
    CATEGORIES: "/services/categories",
    FEATURED: "/services/featured",
    BY_PROVIDER: (providerId) => `/services/provider/${providerId}`,
    PROVIDER_REVIEWS: (providerId) =>
      `/services/providers/${providerId}/reviews`,
    PROVIDER_PROFILE: (providerId) =>
      `/services/providers/${providerId}/profile`,
  },

  // Dashboard
  DASHBOARD: {
    DEFAULT: "/dashboard",
    RENTER: "/dashboard/renter",
    OWNER: "/dashboard/owner",
    PROVIDER: "/dashboard/provider",
  },

  // Bookings
  BOOKINGS: {
    CREATE: "/bookings",
    LIST: "/bookings",
    MY_BOOKINGS: "/bookings/my-bookings",
    DETAIL: (id) => `/bookings/${id}`,
    UPDATE_STATUS: (id) => `/bookings/${id}/status`,
    CANCEL: (id) => `/bookings/${id}/cancel`,
  },

  // Reviews
  REVIEWS: {
    CREATE: "/reviews",
    LIST: "/reviews",
    DETAIL: (id) => `/reviews/${id}`,
    UPDATE: (id) => `/reviews/${id}`,
    DELETE: (id) => `/reviews/${id}`,
    HELPFUL: (id) => `/reviews/${id}/helpful`,
  },

  // Admin
  ADMIN: {
    DASHBOARD: "/admin/dashboard",
    USERS: "/admin/users",
    PROPERTIES: "/admin/properties",
    SERVICES: "/admin/services",
    BOOKINGS: "/admin/bookings",
    REVIEWS: "/admin/reviews",
    MODERATE_REVIEW: (id) => `/admin/reviews/${id}/moderate`,
  },

  // Upload
  UPLOAD: {
    FILE: "/upload",
    AVATAR: "/upload/avatar",
    PROPERTY_IMAGE: "/upload/property-image",
    PROFILE: (userId) => `/upload/profile/${userId}`,
  },

  // Search
  SEARCH: {
    GLOBAL: "/search",
    SUGGESTIONS: "/search/suggestions",
  },

  // Notifications
  NOTIFICATIONS: {
    LIST: "/notifications",
    UNREAD_COUNT: "/notifications/unread-count",
    READ: (id) => `/notifications/${id}/read`,
    READ_ALL: "/notifications/mark-all-read",
  },

  // Messages
  MESSAGES: {
    SEND: "/messages",
    LIST: "/messages",
    CONVERSATIONS: "/messages/conversations",
    READ: (id) => `/messages/${id}/read`,
    DELETE: (id) => `/messages/${id}`,
  },

  // Analytics
  ANALYTICS: {
    PROPERTY: (id) => `/analytics/properties/${id}`,
    SERVICE: (id) => `/analytics/services/${id}`,
  },
};

export default API_ENDPOINTS;
