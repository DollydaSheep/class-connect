import { Pressable, ScrollView, View } from "react-native";
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { ChevronDown, ChevronUp, FileText } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { useEffect, useMemo, useState } from "react";
import { THEME } from "@/lib/theme";
import { router } from "expo-router";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useUserRole";



export default function ActivitiesTab() {

  const { user } = useAuth();
  const [activities, setActivities] = useState<any[]>([]);

  const fetchActivities = async () => {
    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (!user || authError) throw new Error("Not authenticated");

      // ✅ 1. Get class IDs where student is enrolled
      const { data: classRows, error: classErr } = await supabase
        .from("class_students")
        .select("class_id")
        .eq("student_id", user.id);

      if (classErr) throw classErr;

      const classIds = classRows.map(row => row.class_id);

      if (classIds.length === 0) {
        setActivities([]);
        return;
      }

      // ✅ 2. Fetch activities with JOINED subject
      const { data, error } = await supabase
        .from("class_activity")
        .select(`
          id,
          class_id,
          instructor_id,
          activity_name,
          description,
          instructions,
          points,
          due_date,
          file_attachments,
          created_at,
          status,
          class:class_id (
            subject
          )
        `)
        .in("class_id", classIds)
        .order("due_date", { ascending: true });

      if (error) throw error;

      setActivities(data ?? []);
    } catch (err) {
      console.error("Fetch activities error:", err);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchActivities();
    }
  }, [user]);

  const groupedActivities = useMemo(() => {
    const groups: Record<string, any[]> = {};

    activities.forEach(item => {
      const dateKey = new Date(item.due_date).toDateString(); // e.g. "Nov 8 2025"

      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }

      groups[dateKey].push(item);
    });

    return groups;
  }, [activities]);

  const formatFullDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "long",   // December
      day: "2-digit",  // 05
      year: "numeric", // 2025
    });
  };

  return(
    <>
      <ScrollView>
      <View className="p-2">

        {Object.keys(groupedActivities).map(date => (
          <View key={date}>
            
            {/* ✅ DATE HEADER */}
            <View className='flex flex-row justify-between items-center w-full mb-2'>
              <Text className="font-semibold my-2">{formatFullDate(date)}</Text>
            </View>

            {/* ✅ ACTIVITIES UNDER DATE */}
            {groupedActivities[date].map((activity, index) => (
              <Pressable
                key={activity.id}
                onPress={() =>
                  router.push({
                    pathname: '/(activity)/[activityid]',
                    params: { activityid: activity.id }
                  })
                }
              >
                <View className='bg-background border border-border p-4 rounded-lg mb-3'>
                  <View className='flex flex-row justify-between'>

                    <View className='flex flex-row items-start gap-4'>
                      <View className='p-2.5 bg-orange-300 rounded-lg'>
                        <Icon as={FileText} className='size-5 text-orange-600' />
                      </View>

                      <View>
                        <Text className='font-medium'>{activity.activity_name}</Text>
                        <Text className="text-xs font-light">{activity.class.subject}</Text>
                        <Text className='text-sm font-medium dark:text-orange-400 text-orange-500'>
                          Due {new Date(activity.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </Text>
                      </View>
                    </View>

                    <View className="self-end">
                      <Text
                        className={`text-xs px-3 py-2 rounded-full text-foreground ${
                          activity.status === "Completed"
                            ? "bg-green-500/50"
                            : "bg-orange-500/50"
                        }`}
                      >
                        {activity.status}
                      </Text>
                    </View>

                  </View>
                </View>
              </Pressable>
            ))}
          </View>
        ))}

      </View>
      </ScrollView>
    </>
  )
}