import { getAnalytics, logEvent, isSupported } from 'firebase/analytics';
import app from './firebase';

let analytics = null;

// Initialize analytics only on client side and if supported
export const initAnalytics = async () => {
  if (typeof window !== 'undefined') {
    const supported = await isSupported();
    if (supported) {
      analytics = getAnalytics(app);
    }
  }
  return analytics;
};

// Log custom events
export const logCustomEvent = (eventName, eventParams = {}) => {
  if (analytics) {
    logEvent(analytics, eventName, eventParams);
  }
};

// Track page views
export const trackPageView = (pageName) => {
  logCustomEvent('page_view', { page_name: pageName });
};

// Track Salah progress
export const trackSalahProgress = (completed, total) => {
  logCustomEvent('salah_progress', {
    completed_days: completed,
    total_days: total,
    percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
  });
};

// Track Siyam progress
export const trackSiyamProgress = (completed, total) => {
  logCustomEvent('siyam_progress', {
    completed_days: completed,
    total_days: total,
    percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
  });
};

// Track milestone achievements
export const trackMilestone = (type, percentage) => {
  logCustomEvent('milestone_achieved', {
    type, // 'salah' or 'siyam'
    percentage,
  });
};

export default analytics;
