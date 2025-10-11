import { useColorScheme } from "nativewind";
import { ScrollView, View } from "react-native";
import ClassesComponent from "./classes";
import AnnouncementsHomeComponent from "./announcementsHome";
import UpcomingActivitiesHome from "./activitiesHome";


export default function StudentHome() {
  const { colorScheme } = useColorScheme();

  return(
    <>
      <ScrollView className='flex-1 bg-foreground/5'>
        <View className='flex-1 w-full gap-2 p-4'>
          <ClassesComponent />

          <AnnouncementsHomeComponent />

          <UpcomingActivitiesHome />

        </View>
      </ScrollView>
    </>
  )
}