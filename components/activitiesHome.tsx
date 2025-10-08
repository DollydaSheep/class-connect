import { View } from "react-native";
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { FileText } from "lucide-react-native";


export default function UpcomingActivitiesHome() {
  return(
    <>
      <View className='my-2'>
        <Text className="font-semibold">Upcoming Activities</Text>
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
  )
}