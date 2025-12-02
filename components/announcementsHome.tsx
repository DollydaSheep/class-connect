import { Pressable, View } from "react-native";
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { Bell, ChevronDown, ChevronUp } from "lucide-react-native";
import { useState } from "react";
import { useColorScheme } from "nativewind";
import { THEME } from "@/lib/theme";


export default function AnnouncementsHomeComponent() {

  const { colorScheme } = useColorScheme();

  const [showComponent, setShowComponent] = useState(true)

  return(
    <>
      <Pressable className='active:opacity-75' onPress={()=>setShowComponent(!showComponent)}>
        <View className='flex flex-row justify-between my-2 mr-2'>
          <Text className="font-semibold">Recent Announcements</Text>
          {showComponent === true ? (
            <ChevronUp 
              color={colorScheme === 'dark' ? THEME.dark.foreground : THEME.light.foreground}
            />
          ): (
            <ChevronDown 
              color={colorScheme === 'dark' ? THEME.dark.foreground : THEME.light.foreground}
            />
          )}
        </View>
      </Pressable>

      {showComponent && (
        <>
          <View className='bg-background p-4 rounded-lg'>
            <View className='flex flex-row justify-between'>
              <View className='flex flex-row items-start gap-4'>
                <View className='p-3 bg-blue-300 rounded-lg'>
                  <View>
                    <Icon as={Bell} className='size-4 text-blue-600' />
                  </View>
                </View>
                <View>
                  <Text className='font-medium'>Midterm Exam Schedule</Text>
                  <Text className='text-xs font-light'>Prof. Kenneth Romero</Text>
                  <Text className='text-xs font-light mt-2 dark:text-gray-400 text-gray-600'>2 hours ago</Text>
                </View>
              </View>
            </View>
          </View>

          <View className='bg-background p-4 rounded-lg'>
            <View className='flex flex-row justify-between'>
              <View className='flex flex-row items-start gap-4'>
                <View className='p-3 bg-blue-300 rounded-lg'>
                  <View>
                    <Icon as={Bell} className='size-4 text-blue-600' />
                  </View>
                </View>
                <View>
                  <Text className='font-medium'>Guest Lecture Next Week</Text>
                  <Text className='text-xs font-light'>Prof. Justin Nabunturan</Text>
                  <Text className='text-xs font-light mt-2 dark:text-gray-400 text-gray-600'>2 hours ago</Text>
                </View>
              </View>
            </View>
          </View>
        </>
      )}
    </>
  )
}