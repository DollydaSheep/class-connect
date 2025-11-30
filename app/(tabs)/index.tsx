import UpcomingActivitiesHome from '@/components/activitiesHome';
import AnnouncementsHomeComponent from '@/components/announcementsHome';
import CalendarComponent from '@/components/calendarHome';
import ClassesComponent from '@/components/classes';
import InstructorClassesComponent from '@/components/instructorClassesHome';
import LoginScreen from '@/components/loginScreen';
import SignUpScreen from '@/components/signUpScreen';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useAuth } from '@/hooks/useUserRole';
import { supabase } from '@/lib/supabase';
import { THEME } from '@/lib/theme';
import { Link, Stack } from 'expo-router';
import { Bell, Ellipsis, FileText, MoonStarIcon, Plus, PlusCircle, StarIcon, SunIcon } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import { useEffect, useState } from 'react';
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
  const [isLogin, setIsLogin] = React.useState(true);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setRole(null);
      setLoading(false);
      return;
    }

    const fetchRole = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Fetch role error:", error.message);
        setRole(null);
      } else {
        console.log(data.role)
        setRole(data.role);
      }

      setLoading(false);
    };

    fetchRole();
  }, [user]);

  if(!user){
    return (
      <>
        <View className='flex-1 bg-foreground/5'>
          {isLogin ? (
            <LoginScreen onSwitch={()=>setIsLogin(false)} />
          ) : (
            <SignUpScreen onSwitch={()=>setIsLogin(true)} />
          )}
        </View>
          
      </>
    );
  }
  if(role === 'student'){
    return(
      <>
        <View className='p-2'>
          <ScrollView>
            <ClassesComponent />

            <CalendarComponent />

            <AnnouncementsHomeComponent />

            <UpcomingActivitiesHome />
          </ScrollView>
        </View>
      </>
    )
  }
  if(role === 'instructor'){
    return(
      <>
        <View className='p-2'>
          <ScrollView>
            
            <InstructorClassesComponent />

          </ScrollView>
        </View>
      </>
    )
  }
  
}

