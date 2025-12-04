import '@/global.css';
import { NAV_THEME, THEME } from '@/lib/theme';
import { ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import { useAuth } from '@/hooks/useUserRole';
import { RefreshProvider } from '@/hooks/refreshContext';



export default function RootLayout() {
  const { colorScheme } = useColorScheme();

  return (
    <ThemeProvider value={NAV_THEME[colorScheme ?? 'light']}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        <RefreshProvider>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }}/>        {/* tabs layout */}

          </Stack>
        </RefreshProvider>
      <PortalHost />
    </ThemeProvider>
  );
}
