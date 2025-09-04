import Constants from 'expo-constants';

// Check if we're running in Expo Go
const isExpoGo = Constants.appOwnership === 'expo';

// Conditionally import expo-notifications only when not in Expo Go
let Notifications = null;
if (!isExpoGo) {
  try {
    Notifications = require('expo-notifications');
  } catch (error) {
    console.log('expo-notifications not available');
  }
}

// Safe notification functions that work in both Expo Go and development builds
export const safeNotifications = {
  setNotificationHandler: (handler) => {
    if (!isExpoGo && Notifications) {
      Notifications.setNotificationHandler(handler);
    }
  },

  requestPermissionsAsync: async () => {
    if (!isExpoGo && Notifications) {
      return await Notifications.requestPermissionsAsync();
    }
    return { status: 'denied' };
  },

  scheduleNotificationAsync: async (notification) => {
    if (!isExpoGo && Notifications) {
      return await Notifications.scheduleNotificationAsync(notification);
    }
    // In Expo Go, we can't show notifications, so we just return a mock response
    return { id: 'mock-notification-id' };
  }
};

export default safeNotifications;
