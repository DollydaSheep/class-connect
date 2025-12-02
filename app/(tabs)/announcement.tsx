import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { THEME } from "@/lib/theme";
import { router } from "expo-router";
import { Bell, ChevronRight } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { Pressable, View } from "react-native";


export default function AnnouncementTab() {

  const { colorScheme } = useColorScheme();

  return(
    <>
      <View className="p-2 gap-3">
        <Pressable onPress={()=>{router.push({
          pathname: '/(announcement)/[announcementid]',
          params: { announcementid: '1' }
        })}}
        >
          <View className='bg-background border border-border p-4 rounded-lg'>
            <View className='flex flex-row justify-between'>
              <View className='flex flex-row items-start gap-4'>
                <View className='p-3 bg-blue-300 rounded-lg'>
                  <View>
                    <Icon as={Bell} className='size-4 text-blue-600' />
                  </View>
                </View>
                <View>
                  <Text className='font-medium'>Midterm Exam Schedule</Text>
                  <Text className="text-xs font-light">CE Project I</Text>
                  <Text className='text-xs font-light'>Prof. Nyoken Romero</Text>
                  <Text className='text-xs font-light mt-2 dark:text-gray-400 text-gray-600'>2 hours ago</Text>
                </View>
                <View className="self-end ml-4">
                  <ChevronRight 
                    color={colorScheme === 'dark' ? THEME.dark.foreground : THEME.light.foreground}
                  />
                </View>
              </View>
            </View>
          </View>
        </Pressable>

        <View className='bg-background border border-border p-4 rounded-lg'>
          <View className='flex flex-row justify-between'>
            <View className='flex flex-row items-start gap-4'>
              <View className='p-3 bg-blue-300 rounded-lg'>
                <View>
                  <Icon as={Bell} className='size-4 text-blue-600' />
                </View>
              </View>
              <View>
                <Text className='font-medium'>Guest Lecture Next Week</Text>
                <Text className="text-xs font-light">Technopreneurship</Text>
                <Text className='text-xs font-light'>Prof. Justin Nabunturan</Text>
                <Text className='text-xs font-light mt-2 dark:text-gray-400 text-gray-600'>2 hours ago</Text>
              </View>
              <View className="self-end ml-4">
                <ChevronRight 
                  color={colorScheme === 'dark' ? THEME.dark.foreground : THEME.light.foreground}
                />
              </View>
            </View>
          </View>
        </View>
      </View>
    </>
  )
}