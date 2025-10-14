import LoginScreen from '@/components/loginScreen';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import '@/global.css';
import { useAuth } from '@/hooks/useUserRole';


import { NAV_THEME, THEME } from '@/lib/theme';
import { ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { Stack, Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Bell, BookOpen, FileText, House, MoonStarIcon, SunIcon } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { View } from 'react-native';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

const SCREEN_OPTIONS = {
    light: {
      title: 'ClassConnect',
      headerTransparent: false,
      headerShadowVisible: true,
      headerStyle: { backgroundColor: THEME.light.background },
      headerRight: () => <ThemeToggle />,
    },
    dark: {
      title: 'ClassConnect',
      headerTransparent: false,
      headerShadowVisible: true,
      headerStyle: { backgroundColor: THEME.dark.background },
      headerRight: () => <ThemeToggle />,
    },
  };


export default function RootLayout() {
  const { colorScheme } = useColorScheme();
  const { user } = useAuth();

  if(user === null){
    return(
      <>
        <ThemeProvider value={NAV_THEME[colorScheme ?? 'light']}>
          <Stack>
            <Stack.Screen
              name="index"
              options={{
                title: "ClassConnect",
                headerStyle: { backgroundColor: colorScheme === 'dark' ? THEME.dark.background : THEME.light.background },
                headerTintColor: colorScheme === 'dark' ? '#fff' : '#000',
                headerTitleStyle: { fontWeight: "bold" },
              }}
            />
          </Stack>
        </ThemeProvider>
      </>
    )
  }

  return (
    <ThemeProvider value={NAV_THEME[colorScheme ?? 'light']}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        <Tabs screenOptions={{ tabBarActiveTintColor: colorScheme === 'dark' ? 'white' : 'black' }}>
          <Tabs.Screen 
            name='index'
            options={{
              ...SCREEN_OPTIONS[colorScheme ?? "light"],
              tabBarLabel: "Home",
              tabBarIcon: ({color, size}) =>(
                <House 
                  className='size-6'
                  color={color}
                />
              )
            }}
          />
          <Tabs.Screen 
            name='activities'
            options={{
              headerTitle: () => (
                <View>
                  <Text className='text-lg font-semibold'>Activities</Text>
                  <Text className='text-sm dark:text-gray-400 text-gray-600'>Assignments, quizzes & tasks</Text>
                </View>
              ),
              tabBarLabel: "Activities",
              tabBarIcon: ({color,size}) => (
                <FileText 
                  className='size-6'
                  color={color}
                />
              )
            }}
          />
          <Tabs.Screen 
            name='modules'
            options={{
              headerTitle: () => (
                <View>
                  <Text className='text-lg font-semibold'>Learning Modules</Text>
                  <Text className='text-sm dark:text-gray-400 text-gray-600'>Access all course materials</Text>
                </View>
              ),
              tabBarLabel: "Modules",
              tabBarIcon: ({color,size}) => (
                <BookOpen 
                  className='size-6'
                  color={color}
                />
              )
            }}
          />
          <Tabs.Screen 
            name='announcement'
            options={{
              headerTitle: () => (
                <View>
                  <Text className='text-lg font-semibold'>Announcements</Text>
                  <Text className='text-sm dark:text-gray-400 text-gray-600'>Stay updated with class news</Text>
                </View>
              ),
              tabBarLabel: "Announcements",
              tabBarIcon: ({color,size}) =>(
                <Bell 
                  className='size-6'
                  color={color}
                />
              )
            }}
          />
        </Tabs>
      <PortalHost />
    </ThemeProvider>
  );
}

function ThemeToggle() {
  const { colorScheme, toggleColorScheme } = useColorScheme();

  const THEME_ICONS = {
    light: SunIcon,
    dark: MoonStarIcon,
  };

  return (
    <Button
      onPressIn={toggleColorScheme}
      size="icon"
      variant="ghost"
      className="rounded-full web:mx-4">
      <Icon as={THEME_ICONS[colorScheme ?? 'light']} className="size-5" />
    </Button>
  );
}