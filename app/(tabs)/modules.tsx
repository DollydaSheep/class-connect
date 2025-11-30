import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { FileText } from "lucide-react-native";
import { View } from "react-native";


export default function ModulesTab() {
  return(
    <>
      <View className="p-2 gap-3">
        <View className='bg-background border border-border p-4 rounded-lg'>
          <View className='flex flex-row justify-between'>
            <View className='flex flex-row items-start gap-4'>
              <View className='p-2.5 bg-orange-300 rounded-lg'>
                <View>
                  <Icon as={FileText} className='size-5 text-orange-600' />
                </View>
              </View>
              <View>
                <Text className='font-medium'>CE Comprehensive Course 1</Text>
                <Text className="text-xs font-light">Prof. Justin Nabunturan</Text>
              </View>
            </View>
          </View>
          <View className="pt-4">
            <View className="border-t border-border"></View>
          </View>
          <Text className="pt-2 text-xs font-light text-foreground/50">10 Files</Text>
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