import { Pressable, ScrollView, View } from "react-native";
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { ChevronDown, ChevronUp, Ellipsis, FileText } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { useEffect, useMemo, useState } from "react";
import { THEME } from "@/lib/theme";
import { router } from "expo-router";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useUserRole";
import Skeletonbox from "@/components/skeleton/skeletonbox";



export default function ActivitiesTab() {

  const { user } = useAuth();
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<string | null>(null);

  const [toggleDropdown, setToggleDropdown] = useState<string | null>();

  useEffect(() => {
    if (!user) {
      setRole(null);
      return;
    }

    const fetchRole = async () => {

      const { data, error } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Fetch role error:", error.message);
        setRole(null);
      } else {
        console.log(data.role)
        setRole(data.role);
      }
    };

    fetchRole();
  }, [user]);

  const fetchActivities = async () => {
    try {
      setLoading(true)
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (!user || authError) throw new Error("Not authenticated");

      if(role === "student"){
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
      } else if(role === 'instructor'){
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
          .eq("instructor_id", user.id)
          .order("due_date", { ascending: true });

        if (error) throw error;

        setActivities(data ?? []);
      }
      
    } catch (err) {
      console.error("Fetch activities error:", err);
    } finally {
      setLoading(false)
    }
  };

  const handleDeleteActivity = async (activityid: string) => {
    setActivities([]);
    setLoading(true);
    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (!user || authError) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("class_activity")
        .delete()
        .eq("id", activityid)
        .eq("instructor_id", user.id); // ✅ Security check

      if (error) throw error;

      setLoading(false);
      setToggleDropdown(null)

      alert("Activity deleted ✅");

      await fetchActivities();

    } catch (err: any) {
      console.error("Delete activity failed:", err);
      alert(err.message || "Failed to delete activity");
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchActivities();
    }
  }, [user,role]);

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

  const handleDropdown = (activityid: string) => {
		setToggleDropdown(prev => (prev === activityid ? null : activityid));
	};

  return(
    <>
      <ScrollView>
      <View className="p-2">

        {loading ? (
          <View className="gap-3">
            <Skeletonbox width={200} height={40} />
            <Skeletonbox height={100} />
            <Skeletonbox width={200} height={40} />
            <Skeletonbox height={100} />
            <Skeletonbox width={200} height={40} />
            <Skeletonbox height={100} />
          </View>
        ): Object.keys(groupedActivities).length === 0 ? (
            <Text className="text-center text-muted-foreground mt-4">
              No activities found
            </Text>
        ):(
            Object.keys(groupedActivities).map(date => (
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

                        {role === 'student' ? (
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
                        ): (
                          <View className="self-start">
                            <Pressable className='active:opacity-75' onPress={()=>{handleDropdown(activity.id)}}>
                              <Icon as={Ellipsis} className="size-5" />
                            </Pressable>
                            {toggleDropdown === activity.id && (
                              <View className='w-20 border border-border bg-background rounded-lg absolute -top-6 right-8' style={{zIndex: 20}}>
                                <Pressable onPress={()=>{
                                  router.push({
                                  pathname: '/(activity)/editActivity',
                                  params: { activityid: activity.id, classid: activity.class_id }
                                })
                                  setToggleDropdown(null);
                                }}>
                                  <Text className='p-2'>Edit</Text>
                                </Pressable>
                                <Pressable onPress={()=>handleDeleteActivity(activity.id)} className='border-t border-border'>
                                  <Text className='p-2'>Delete</Text>
                                </Pressable>
                              </View>
                            )}
                          </View>
                        )}

                      </View>
                    </View>
                  </Pressable>
                ))}
              </View>
            ))
        ) }

      </View>
      </ScrollView>
    </>
  )
}