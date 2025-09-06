import { logEvent } from 'firebase/analytics';
import { analytics } from './config';

// Custom analytics events
export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (analytics && typeof window !== 'undefined') {
    logEvent(analytics, eventName, parameters);
  }
};

// Specific tracking functions
export const trackProductView = (productId: string, productName: string, category: string) => {
  trackEvent('view_item', {
    item_id: productId,
    item_name: productName,
    item_category: category,
  });
};

export const trackRecipeView = (recipeId: string, recipeName: string) => {
  trackEvent('view_recipe', {
    recipe_id: recipeId,
    recipe_name: recipeName,
  });
};

export const trackCategoryView = (categoryId: string, categoryName: string) => {
  trackEvent('view_category', {
    category_id: categoryId,
    category_name: categoryName,
  });
};

export const trackSearch = (searchTerm: string, resultsCount: number) => {
  trackEvent('search', {
    search_term: searchTerm,
    results_count: resultsCount,
  });
};

export const trackContactSubmit = () => {
  trackEvent('contact_submit');
};

export const trackNewsletterSignup = () => {
  trackEvent('newsletter_signup');
};

export const trackPageView = (pageName: string) => {
  trackEvent('page_view', {
    page_title: pageName,
  });
};