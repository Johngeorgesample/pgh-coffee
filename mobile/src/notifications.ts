import { Platform } from 'react-native';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

// Show notifications while the app is foregrounded.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

/**
 * Requests notification permission and returns an Expo push token.
 *
 * Push tokens are only available on a physical device running a development or
 * production build (not in Expo Go from SDK 53+). Returns null otherwise.
 *
 * To actually deliver notifications you must send this token to a backend and
 * POST to Expo's push API (https://docs.expo.dev/push-notifications/sending-notifications/).
 */
export async function registerForPushNotifications(): Promise<string | null> {
  if (!Device.isDevice) return null;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  const existing = await Notifications.getPermissionsAsync();
  let status = existing.status;
  if (status !== 'granted') {
    const requested = await Notifications.requestPermissionsAsync();
    status = requested.status;
  }
  if (status !== 'granted') return null;

  const projectId =
    Constants.expoConfig?.extra?.eas?.projectId ??
    Constants.easConfig?.projectId;
  if (!projectId || projectId === 'REPLACE_WITH_EAS_PROJECT_ID') return null;

  const token = await Notifications.getExpoPushTokenAsync({ projectId });
  return token.data;
}
