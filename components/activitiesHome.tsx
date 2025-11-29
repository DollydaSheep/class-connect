import { Pressable, View } from "react-native";
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { ChevronDown, ChevronUp, FileText } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { useState } from "react";
import { THEME } from "@/lib/theme";


export default function UpcomingActivitiesHome() {

  const { colorScheme } = useColorScheme();

  const [showComponent, setShowComponent] = useState(true)

  return(
    <>
      <Pressable onPress={()=>setShowComponent(!showComponent)}>
        <View className='flex flex-row justify-between my-2 mr-2'>
          <Text className="font-semibold">Upcoming Activities</Text>
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
                <View className='p-2.5 bg-orange-300 rounded-lg'>
                  <View>
                    <Icon as={FileText} className='size-5 text-orange-600' />
                  </View>
                </View>
                <View>
                  <Text className='font-medium'>Chapter 5 Quiz</Text>
                  <Text className='text-sm font-medium dark:text-orange-400 text-orange-500'>Due Oct 8</Text>
                </View>
              </View>
            </View>
          </View>

          <View className='bg-background p-4 rounded-lg'>
            <View className='flex flex-row justify-between'>
              <View className='flex flex-row items-start gap-4'>
                <View className='p-2.5 bg-orange-300 rounded-lg'>
                  <View>
                    <Icon as={FileText} className='size-5 text-orange-600' />
                  </View>
                </View>
                <View>
                  <Text className='font-medium'>Project</Text>
                  <Text className='text-sm font-medium dark:text-orange-400 text-orange-500'>Due Oct 10</Text>
                </View>
              </View>
            </View>
          </View>
        </>
      )}
    </>
  )
}