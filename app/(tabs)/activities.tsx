import { Pressable, View } from "react-native";
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { ChevronDown, ChevronUp, FileText } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { useState } from "react";
import { THEME } from "@/lib/theme";
import { router } from "expo-router";



export default function ActivitiesTab() {
  return(
    <>
      <View className="p-2">

        <View className='flex flex-row justify-between items-center w-full mb-2' >
          <Text className="font-semibold my-2">November 8, 2025</Text>
        </View>
        <View className='bg-background border border-border p-4 rounded-lg'>
          <View className='flex flex-row justify-between'>
            <View className='flex flex-row items-start gap-4'>
              <View className='p-2.5 bg-orange-300 rounded-lg'>
                <View>
                  <Icon as={FileText} className='size-5 text-orange-600' />
                </View>
              </View>
              <View>
                <Text className='font-medium'>Review</Text>
                <Text className="text-xs font-light">CE Comprehensive Course 1</Text>
                <Text className='text-sm font-medium dark:text-orange-400 text-orange-500'>Due Nov 10</Text>
              </View>
            </View>
            <View className="self-end">
              <Text className="text-xs px-3 py-2 rounded-full bg-yellow-400/50 text-foreground">Pending</Text>
            </View>
          </View>
        </View>

        <View className='flex flex-row justify-between items-center w-full mb-2' >
          <Text className="font-semibold my-2">October 8, 2025</Text>
        </View>
        <Pressable
          key={1} onPress={()=>{router.push({
          pathname: '/(activity)/[activityid]',
          params: { activityid: "1" }
        })}}>
          <View className='bg-background border border-border p-4 rounded-lg'>
            <View className='flex flex-row justify-between'>
              <View className='flex flex-row items-start gap-4'>
                <View className='p-2.5 bg-orange-300 rounded-lg'>
                  <View>
                    <Icon as={FileText} className='size-5 text-orange-600' />
                  </View>
                </View>
                <View>
                  <Text className='font-medium'>Chapter 5 Quiz</Text>
                  <Text className="text-xs font-light">Mathematics</Text>
                  <Text className='text-sm font-medium dark:text-orange-400 text-orange-500'>Due Oct 8</Text>
                </View>
              </View>
              <View className="self-end">
                <Text className="text-xs px-3 py-2 rounded-full bg-green-400/50 text-foreground">Completed</Text>
              </View>
            </View>
          </View>
        </Pressable>
      </View>
    </>
  )
}