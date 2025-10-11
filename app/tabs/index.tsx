import UpcomingActivitiesHome from '@/components/activitiesHome';
import AnnouncementsHomeComponent from '@/components/announcementsHome';
import ClassesComponent from '@/components/classes';
import LoginScreen from '@/components/loginScreen';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { THEME } from '@/lib/theme';
import { Link, Stack } from 'expo-router';
import { Bell, Ellipsis, FileText, MoonStarIcon, Plus, PlusCircle, StarIcon, SunIcon } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import { Image, type ImageStyle, ScrollView, View } from 'react-native';

const LOGO = {
  light: require('@/assets/images/react-native-reusables-light.png'),
  dark: require('@/assets/images/react-native-reusables-dark.png'),
};


const IMAGE_STYLE: ImageStyle = {
  height: 76,
  width: 76,
};

export default function Screen() {
  const { colorScheme } = useColorScheme();

  return (
    <>
      <View className='flex-1 bg-foreground/5'>
        <LoginScreen />   
      </View>
        
    </>
  );
}

