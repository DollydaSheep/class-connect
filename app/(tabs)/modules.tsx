import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { router } from "expo-router";
import { FileText } from "lucide-react-native";
import { Pressable, View } from "react-native";


export default function ModulesTab() {
  return(
    <>
      <View className="p-2 gap-3">
        <Pressable
          key={1} onPress={()=>{router.push({
          pathname: '/(module)/[moduleid]',
          params: { moduleid: "1" }
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
                  <Text className='font-medium text-lg'>Week 1 Module</Text>
                  <Text className='text-xs font-light'>CE Comrpehension Course 1</Text>
                  <Text className="text-xs font-light">Prof. Justin Nabunturan</Text>
                </View>
              </View>
            </View>
            <View className="pt-4">
              <View className="border-t border-border"></View>
            </View>
            <Text className="pt-2 text-xs font-light text-foreground/50">2 Files</Text>
          </View>
        </Pressable>

        <View className='bg-background border border-border p-4 rounded-lg'>
          <View className='flex flex-row justify-between'>
            <View className='flex flex-row items-start gap-4'>
              <View className='p-2.5 bg-orange-300 rounded-lg'>
                <View>
                  <Icon as={FileText} className='size-5 text-orange-600' />
                </View>
              </View>
              <View>
                <Text className='font-medium'>CE Project I</Text>
                <Text className="text-xs font-light">Prof. Nyoken Romero</Text>
              </View>
            </View>
          </View>
          <View className="pt-4">
            <View className="border-t border-border"></View>
          </View>
          <Text className="pt-2 text-xs font-light text-foreground/50">6 Files</Text>
        </View>
      </View>
    </>
  )
}