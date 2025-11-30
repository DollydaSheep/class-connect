import ProfileBanner from "@/components/profileBanner";
import { Text } from "@/components/ui/text";
import { THEME } from "@/lib/theme";
import { LogOut } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { Pressable, View } from "react-native";


export default function ProfileTab() {
  

  return (
    <>
      <View>
        <ProfileBanner />
        
      </View>
    </>
  )
}