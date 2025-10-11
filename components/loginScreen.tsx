import { Pressable, TextInput, View } from "react-native";
import { Text } from '@/components/ui/text';
import { useColorScheme } from "nativewind";
import { SafeAreaView } from "react-native-safe-area-context";


export default function LoginScreen() {
  const { colorScheme } = useColorScheme();

  return(
    <>
      <SafeAreaView className="flex-1 flex-col items-center justify-start p-2 top-5">
        <View className="flex flex-col w-64 gap-1">
          <Text className="text-xl font-semibold">Welcome Back</Text>
          <Text className="text-sm dark:text-gray-400 text-gray-600 mb-4">Sign in to continue to your classes</Text>
          <View className="flex flex-col gap-1 mb-4">
            <Text className="text-sm font-medium">Email</Text>
            <TextInput 
              className="w-full bg-foreground/5 rounded-lg focus:border focus:border-foreground/50 px-3 py-4 text-foreground"
              placeholder="student@email"
              placeholderTextColor={colorScheme === 'dark' ? '#6b7280' : '#9ca3af'}
            />
          </View>
          <View className="flex flex-col gap-1 mb-4">
            <Text className="text-sm font-medium">Password</Text>
            <TextInput 
              className="w-full bg-foreground/5 rounded-lg focus:border focus:border-foreground/50 px-3 py-4 text-foreground"
              placeholder="Enter your password"
              placeholderTextColor={colorScheme === 'dark' ? '#6b7280' : '#9ca3af'}
            />
          </View>
          <Text className="text-sm self-end mb-4">Forgot Password?</Text>
          <Pressable className="mb-2">
            <View className="bg-violet-600 items-center p-3 rounded-lg">
              <Text className="font-semibold">Sign In</Text>
            </View>
          </Pressable>
          <Text className="text-sm text-center">Don't have an account? <Text>Sign Up</Text></Text>
        </View>
      </SafeAreaView>
    </>
  )
}