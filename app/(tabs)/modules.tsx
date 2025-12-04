import Skeletonbox from "@/components/skeleton/skeletonbox";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { useAuth } from "@/hooks/useUserRole";
import { supabase } from "@/lib/supabase";
import { router } from "expo-router";
import { Ellipsis, FileText } from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import { Pressable, View } from "react-native";


export default function ModulesTab() {

  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [modules, setModules] = useState<any[]>();
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

  const fetchModules = async () => {
    try {
      setLoading(true);

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (!user || authError) throw new Error("Not authenticated");

      if(role === 'student') {
        // ✅ 1. Get class IDs where student is enrolled
        const { data: classRows, error: classErr } = await supabase
          .from("class_students")
          .select("class_id")
          .eq("student_id", user.id);

        if (classErr) throw classErr;

        const classIds = classRows.map(row => row.class_id);

        if (classIds.length === 0) {
          setModules([]);
          return;
        }

        // ✅ 2. Fetch modules with subject + instructor
        const { data, error } = await supabase
          .from("class_module")
          .select(`
            id,
            module_name,
            module_overview,
            class_id,
            file_attachments,
            class:class_id (
              subject,
              instructor:instructor_id (
                first_name,
                last_name
              )
            )
          `)
          .in("class_id", classIds)
          .order("created_at", { ascending: true });

        if (error) throw error;

        setModules(data ?? []);
      } else if(role === 'instructor'){
        const { data, error } = await supabase
          .from("class_module")
          .select(`
            id,
            module_name,
            module_overview,
            class_id,
            file_attachments,
            class:class_id (
              subject,
              class_section,
              instructor:instructor_id (
                first_name,
                last_name
              )
            )
          `)
          .eq("instructor_id", user.id)
          .order("created_at", { ascending: true });

        if (error) throw error;

        setModules(data ?? []);
      }

    } catch (err) {
      console.error("Fetch modules error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) fetchModules();
  }, [user,role]);

  const handleDeleteModule = async (moduleid: string) => {
    setModules([]);
    setLoading(true);
    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (!user || authError) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("class_module")
        .delete()
        .eq("id", moduleid)
        .eq("instructor_id", user.id); // ✅ Security check

      if (error) throw error;

      setLoading(false);
      setToggleDropdown(null)

      alert("Module deleted ✅");

      await fetchModules();

    } catch (err: any) {
      console.error("Delete module failed:", err);
      alert(err.message || "Failed to delete module");
    }
  };

  const groupedModules = useMemo(() => {
    const groups: Record<string, any[]> = {};

    modules?.forEach(module => {
      const subject = module.class.subject;

      if (!groups[subject]) {
        groups[subject] = [];
      }

      groups[subject].push(module);
    });

    return groups;
  }, [modules]);

  const handleDropdown = (id: string) => {
		setToggleDropdown(prev => (prev === id ? null : id));
	};
  
  return(
    <>
      <View className="p-2 gap-3">

        {loading ? (
          <View className="gap-3">
            <Skeletonbox width={200} height={40} />
            <Skeletonbox height={100} />
            <Skeletonbox width={200} height={40} />
            <Skeletonbox height={100} />
            <Skeletonbox width={200} height={40} />
            <Skeletonbox height={100} />
          </View>
        ): Object.keys(groupedModules).length === 0 ? (
            <Text className="text-center text-muted-foreground mt-4">
              No modules found
            </Text>
        ):(
          Object.keys(groupedModules).map(subject => (
            <View key={subject}>

              {/* ✅ SUBJECT HEADER */}
              <View className="flex flex-row justify-between items-center w-full">
                <Text className="font-semibold my-2">{subject}</Text>
              </View>

              {/* ✅ MODULES UNDER SUBJECT */}
              {groupedModules[subject].map(module => (
                <Pressable
                  key={module.id}
                  onPress={() =>
                    router.push({
                      pathname: "/(module)/[moduleid]",
                      params: { moduleid: module.id },
                    })
                  }
                >
                  <View className="bg-background border border-border p-4 rounded-lg mb-3">

                    <View className="flex flex-row justify-between">

                      <View className="flex flex-row items-start gap-4">
                        <View className="p-2.5 bg-orange-300 rounded-lg">
                          <Icon as={FileText} className="size-5 text-orange-600" />
                        </View>

                        <View>
                          <Text numberOfLines={1} className="font-medium text-lg w-[200px] truncate">{module.module_name}</Text>
                          <Text className="text-xs font-light">{subject}</Text>
                          <Text className="text-xs font-light">
                            Prof. {module.class.instructor.first_name}{" "}
                            {module.class.instructor.last_name}
                          </Text>
                        </View>
                      </View>
                      {role === 'instructor' && (
                        <>
                          <Pressable className='active:opacity-75' onPress={()=>{handleDropdown(module.id)}}>
                            <Icon as={Ellipsis} className="size-5" />
                          </Pressable>
                          {toggleDropdown === module.id && (
                            <View className='w-20 border border-border bg-background rounded-lg absolute -top-6 right-8' style={{zIndex: 20}}>
                              <Pressable onPress={()=>{
                                router.push({
                                pathname: '/(module)/editModule',
                                params: { moduleid: module.id, classid: module.class_id }
                              })
                                setToggleDropdown(null);
                              }}>
                                <Text className='p-2'>Edit</Text>
                              </Pressable>
                              <Pressable onPress={()=>handleDeleteModule(module.id)} className='border-t border-border'>
                                <Text className='p-2'>Delete</Text>
                              </Pressable>
                            </View>
                          )}
                        </>
                      )}

                    </View>

                    <View className="pt-4">
                      <View className="border-t border-border" />
                    </View>

                    <Text className="pt-2 text-xs font-light text-foreground/50">
                      {module.file_attachments.length} File{module.file_attachments.length > 1 ? "s" : ""}
                    </Text>

                  </View>
                </Pressable>
              ))}

            </View>
          ))
        )}

      </View>
    </>
  )
}