import Skeletonbox from "@/components/skeleton/skeletonbox";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { useAppRefresh } from "@/hooks/refreshContext";
import { useAuth } from "@/hooks/useUserRole";
import { supabase } from "@/lib/supabase";
import { THEME } from "@/lib/theme";
import { router } from "expo-router";
import { Bell, ChevronRight, Ellipsis } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { useEffect, useState } from "react";
import { Pressable, RefreshControl, ScrollView, View } from "react-native";


export default function AnnouncementTab() {

  const { user } = useAuth();

  const { colorScheme } = useColorScheme();

  const [role, setRole] = useState<string | null>(null);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [toggleDropdown, setToggleDropdown] = useState<string | null>();
  const { setIsRefreshing, isRefreshing ,refreshFlag ,triggerRefresh } = useAppRefresh();

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

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (!user || authError) throw new Error("Not authenticated");

      if(role === 'student') {
        // ✅ 1. Get enrolled class IDs
        const { data: classRows, error: classErr } = await supabase
          .from("class_students")
          .select("class_id")
          .eq("student_id", user.id);

        if (classErr) throw classErr;

        const classIds = classRows.map(row => row.class_id);

        if (classIds.length === 0) {
          setAnnouncements([]);
          return;
        }

        // ✅ 2. Fetch announcements with subject + instructor
        const { data, error } = await supabase
          .from("class_announcement")
          .select(`
            id,
            announcement_title,
            content,
            created_at,
            class:class_id (
              subject
            ),
            instructor:instructor_id (
              first_name,
              last_name
            )
          `)
          .in("class_id", classIds)
          .order("created_at", { ascending: false });

        if (error) throw error;

        setAnnouncements(data ?? []);
      } else if(role === 'instructor') {
        const { data, error } = await supabase
          .from("class_announcement")
          .select(`
            id,
            announcement_title,
            content,
            created_at,
            class:class_id (
              subject
            ),
            instructor:instructor_id (
              first_name,
              last_name
            )
          `)
          .eq("instructor_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;

        setAnnouncements(data ?? []);
      }
    } catch (err) {
      console.error("Fetch announcements error:", err);
    } finally {
      setLoading(false);
      setIsRefreshing(false)
    }
  };

  const handleDeleteAnnouncement = async (announcementid: string) => {
    setAnnouncements([]);
    setLoading(true);
    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (!user || authError) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("class_announcement")
        .delete()
        .eq("id", announcementid)
        .eq("instructor_id", user.id); // ✅ Security check

      if (error) throw error;

      setLoading(false);
      setToggleDropdown(null)

      alert("Announcement deleted ✅");

      await fetchAnnouncements();

    } catch (err: any) {
      console.error("Delete announcement failed:", err);
      alert(err.message || "Failed to delete announcement");
    }
  };

  useEffect(() => {
    if (user?.id) fetchAnnouncements();
  }, [user, role, refreshFlag]);

  const timeAgo = (date: string) => {
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);

    const intervals = [
      { label: "year", seconds: 31536000 },
      { label: "month", seconds: 2592000 },
      { label: "day", seconds: 86400 },
      { label: "hour", seconds: 3600 },
      { label: "minute", seconds: 60 },
    ];

    for (const i of intervals) {
      const count = Math.floor(seconds / i.seconds);
      if (count >= 1) {
        return `${count} ${i.label}${count > 1 ? "s" : ""} ago`;
      }
    }

    return "Just now";
  };

  const handleDropdown = (id: string) => {
		setToggleDropdown(prev => (prev === id ? null : id));
	};

  return(
    <>
      <ScrollView refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={async ()=>{setIsRefreshing(true);triggerRefresh();}} />}>
      <View className="p-2 gap-3">
      
        {loading ? (
          <View className="gap-3">
            <Skeletonbox height={120} />       
            <Skeletonbox height={120} />          
          </View>
        ) : announcements.length === 0 ? (
          <Text className="text-center text-muted-foreground mt-4">
            No announcements found
          </Text>
        ) : (
          announcements.map(item => (
            <Pressable
              key={item.id}
              className="bg-background border border-border p-4 rounded-lg"
              onPress={() =>
                router.push({
                  pathname: "/(announcement)/[announcementid]",
                  params: { announcementid: item.id },
                })
              }
            >
              <View className="flex flex-row justify-between">

                <View className="flex flex-row items-start gap-4">
                  <View className="p-3 bg-blue-300 rounded-lg">
                    <Icon as={Bell} className="size-4 text-blue-600" />
                  </View>

                  <View>
                    <Text numberOfLines={1} className="font-medium w-[200px]">
                      {item.announcement_title}
                    </Text>

                    <Text className="text-xs font-light">
                      {item.class.subject}
                    </Text>

                    <Text className="text-xs font-light">
                      Prof. {item.instructor.first_name} {item.instructor.last_name}
                    </Text>

                    <Text className="text-xs font-light mt-2 dark:text-gray-400 text-gray-600">
                      {timeAgo(item.created_at)}
                    </Text>
                  </View>

                </View>
                <View className={`${role === 'instructor' ? "self-stretch" : "self-end"} justify-between`}>
                  {role === 'instructor' && (
                    <>
                      <Pressable className='active:opacity-75' onPress={()=>{handleDropdown(module.id)}}>
                        <Icon as={Ellipsis} className="size-5" />
                      </Pressable>
                      {toggleDropdown === module.id && (
                        <View className='w-20 border border-border bg-background rounded-lg absolute -top-6 right-8' style={{zIndex: 20}}>
                          <Pressable onPress={()=>{
                            router.push({
                            pathname: '/(announcement)/editAnnouncement',
                            params: { announcementid: item.id, classid: item.class_id }
                          })
                            setToggleDropdown(null);
                          }}>
                            <Text className='p-2'>Edit</Text>
                          </Pressable>
                          <Pressable onPress={()=>handleDeleteAnnouncement(item.id)} className='border-t border-border'>
                            <Text className='p-2'>Delete</Text>
                          </Pressable>
                        </View>
                      )}
                    </>
                  )}
                  <ChevronRight
                    color={colorScheme === "dark"
                      ? THEME.dark.foreground
                      : THEME.light.foreground}
                  />
                </View>
              </View>
            </Pressable>
          ))
        )}
        
      </View>
      </ScrollView>
    </>
  )
}