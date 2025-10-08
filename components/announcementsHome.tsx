import { View } from "react-native";
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { Bell } from "lucide-react-native";


export default function AnnouncementsHomeComponent() {
  return(
    <>
      <View className='my-2'>
        <Text className="font-semibold">Recent Announcements</Text>
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
  )
}