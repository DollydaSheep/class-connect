import { View } from "react-native";
import { Text } from "./ui/text";
import { Pressable } from "react-native";
import { LogOut } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { THEME } from "@/lib/theme";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { supabase } from "@/lib/supabase";


export default function ProfileBanner() {
  const { colorScheme } = useColorScheme();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) throw error;

      console.log("Signed out");
    } catch (err: any) {
      console.error("Logout error:", err.message);
    }
  };


  return (
    <>
      <View className="flex flex-col justify-center py-8 px-2 bg-foreground/5">
        <View className="flex flex-row items-center px-4 gap-4">
          <View className="bg-white px-6 py-4 rounded-full">
            <Text className="text-background">P</Text>
          </View>
          <View>
            <Text className="font-semibold">Student Name</Text>
            <Text className="text-xs dark:text-gray-400 text-gray-600">student@email.edu</Text>
          </View>
        </View>
      </View>
      <Pressable className="m-4" onPress={handleLogout}>
        <View className="flex flex-row justify-center bg-red-500 p-3 rounded-lg gap-1">
          <LogOut 
            className="size-6"
            color={colorScheme === "dark" ? THEME.dark.foreground : THEME.light.foreground}
          />
          <Text>Logout</Text>
        </View>
      </Pressable>
    </>
  )
}