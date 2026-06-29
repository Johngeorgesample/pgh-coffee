import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  BackHandler,
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { WebView, type WebViewNavigation } from 'react-native-webview';
import type { ShouldStartLoadRequest } from 'react-native-webview/lib/WebViewTypes';
import NetInfo from '@react-native-community/netinfo';
import * as SplashScreen from 'expo-splash-screen';

import { registerForPushNotifications } from './src/notifications';

const SITE_URL = 'https://pgh.coffee';
const BRAND_YELLOW = '#FDE047';

// Hosts that stay inside the in-app WebView. Everything else (external sites,
// mailto:, tel:, maps links) opens in the system handler.
const IN_APP_HOSTS = ['pgh.coffee', 'www.pgh.coffee'];

SplashScreen.preventAutoHideAsync().catch(() => {
  /* fine if this no-ops */
});

function hostOf(url: string): string | null {
  const match = /^[a-z]+:\/\/([^/]+)/i.exec(url);
  return match ? match[1].toLowerCase() : null;
}

export default function App() {
  const webViewRef = useRef<WebView>(null);
  const canGoBack = useRef(false);

  const [loading, setLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOffline(state.isConnected === false);
    });
    return unsubscribe;
  }, []);

  // Safety net: hide the native splash shortly after mount so an offline or
  // failed cold launch can't leave it covering the fallback screen forever.
  // (onLoadEnd only fires when the WebView actually loads.)
  useEffect(() => {
    const timer = setTimeout(() => {
      SplashScreen.hideAsync().catch(() => {});
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Register for push notifications (no-op in Expo Go / without a build).
  useEffect(() => {
    registerForPushNotifications().catch(() => {
      /* push is best-effort; never block the app on it */
    });
  }, []);

  // Android hardware back navigates WebView history before exiting the app.
  useEffect(() => {
    if (Platform.OS !== 'android') return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (canGoBack.current) {
        webViewRef.current?.goBack();
        return true;
      }
      return false;
    });
    return () => sub.remove();
  }, []);

  const onNavStateChange = useCallback((nav: WebViewNavigation) => {
    canGoBack.current = nav.canGoBack;
  }, []);

  // Keep first-party navigation in-app; hand off everything else to the OS.
  const onShouldStartLoad = useCallback((req: ShouldStartLoadRequest) => {
    const host = hostOf(req.url);
    const isInApp =
      req.url.startsWith('about:') ||
      (host !== null && IN_APP_HOSTS.includes(host));

    if (isInApp) return true;

    Linking.openURL(req.url).catch(() => {
      /* ignore unopenable URLs */
    });
    return false;
  }, []);

  const reload = useCallback(() => {
    setLoadFailed(false);
    setLoading(true);
    webViewRef.current?.reload();
  }, []);

  const onLoadEnd = useCallback(() => {
    setLoading(false);
    SplashScreen.hideAsync().catch(() => {});
  }, []);

  const showFallback = isOffline || loadFailed;

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <StatusBar style="dark" />

        {showFallback ? (
          <View style={styles.center}>
            <Text style={styles.title}>You're offline</Text>
            <Text style={styles.body}>
              pgh.coffee needs an internet connection. Check your network and try
              again.
            </Text>
            <Pressable style={styles.button} onPress={reload}>
              <Text style={styles.buttonText}>Retry</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.flex}>
            <WebView
              ref={webViewRef}
              source={{ uri: SITE_URL }}
              originWhitelist={['https://*', 'about:*']}
              onNavigationStateChange={onNavStateChange}
              onShouldStartLoadWithRequest={onShouldStartLoad}
              onLoadEnd={onLoadEnd}
              onError={() => setLoadFailed(true)}
              onHttpError={() => setLoading(false)}
              pullToRefreshEnabled
              allowsBackForwardNavigationGestures
              setSupportMultipleWindows={false}
              startInLoadingState={false}
              mediaPlaybackRequiresUserAction
              applicationNameForUserAgent="pgh.coffee-app"
              style={styles.flex}
            />
            {loading && (
              <View style={styles.loadingOverlay} pointerEvents="none">
                <ActivityIndicator size="large" color="#1f2937" />
              </View>
            )}
          </View>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BRAND_YELLOW },
  flex: { flex: 1 },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: '#fff',
  },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 12, color: '#111827' },
  body: {
    fontSize: 15,
    color: '#4b5563',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  button: {
    backgroundColor: BRAND_YELLOW,
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 999,
  },
  buttonText: { fontSize: 16, fontWeight: '600', color: '#111827' },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BRAND_YELLOW,
  },
});
