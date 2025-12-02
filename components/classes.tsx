"use client"

import { Animated, Modal, Pressable, ScrollView, TextInput, TouchableOpacity, View } from "react-native";
import { useColorScheme } from 'nativewind';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { Ellipsis, Plus, Scroll, X } from "lucide-react-native";
import { getClasses, subscribeToClasses, Class, addClass, deleteClass } from '@/lib/services/classService';
import { useEffect, useRef, useState } from "react";
import { DropdownMenu, DropdownMenuItem, DropdownMenuSeparator} from "./ui/dropdown-menu";
import { router } from "expo-router";
import { supabase } from "@/lib/supabase";


export default function ClassesComponent() {
  const { colorScheme } = useColorScheme();

  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [classCode, setClassCode] = useState("");

  // useEffect(() => {
  //   const unsubscribe = subscribeToClasses(
  //     (updatedClasses) => {
  //       console.log('Classes updated:', updatedClasses);
  //       setClasses(updatedClasses);
  //       setLoading(false);
  //     },
  //     (error) => {
  //       console.error('Subscription error:', error);
  //       setLoading(false);
  //     }
  //   );
  //   return () => unsubscribe();
  // }, []);

  const handleFetchClasses = async () => {
    setLoading(true);

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("class_students")
        .select(`
          class_id,
          class:class_id (
            id,
            subject,
            class_section,
            description,
            class_code,
            instructor_id,
            instructors:instructor_id (
              first_name,
              last_name
            )
          )
        `)
        .eq("student_id", user.id);

      if (error) throw error;

      const joinedClasses = data.map(item => item.class);

      console.log(joinedClasses);
      setClasses(joinedClasses);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
		handleFetchClasses();
	}, []);

  const handleJoinClass = async () => {
    try {
      setLoading(true);

      // ✅ Get logged-in student
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error("Not authenticated");
      }

      // ✅ Find class by code
      const { data: classData, error: classError } = await supabase
        .from("class")
        .select("id")
        .eq("class_code", classCode.trim())
        .single();

      if (classError || !classData) {
        throw new Error("Invalid class code");
      }

      // ✅ Enroll student
      const { error: joinError } = await supabase
        .from("class_students")
        .insert([
          {
            class_id: classData.id,
            student_id: user.id,
          },
        ]);

      if (joinError) {
        if (joinError.code === "23505") {
          throw new Error("You are already enrolled in this class");
        }
        throw joinError;
      }

      alert("Successfully joined the class!");

      await handleFetchClasses()
    } catch (err: any) {
      console.error("Join class failed:", err);
      alert(err.message || "Failed to join class");
    } finally {
      setLoading(false);
    }
  };

  return(
    <>
      <View className='flex flex-row justify-between items-center w-full mb-2' >
        <Text className="font-semibold my-2">Your classes</Text>
        <Pressable 
          className='rounded-full bg-foreground p-2 active:opacity-70 active:scale-95' 
          onPress={()=> setVisible(true)}
        >
          <Icon as={Plus} className='size-6 text-background' />  
        </Pressable>
      </View>

      {/* {loading ? (
        <Text>No Class</Text>
      ) : classes.map((classItem, index) => (
        <View key={index} className='bg-background p-4 rounded-lg'>
          <View className='flex flex-row justify-between'>
            <View className='flex flex-row items-start gap-4'>
              <View className='px-4 py-3 bg-violet-500 rounded-lg'>
                <Text className='text-white'>M</Text>
              </View>
              <View>
                <Text className='font-medium'>{classItem.name}</Text>
                <Text className='text-xs font-light'>Prof. {classItem.instructor}</Text>
                <Text className='text-xs font-light mt-2 dark:text-gray-400 text-gray-600'>Code: {classItem.classCode}</Text>
              </View>
            </View> 
              <DropdownMenu
                trigger={
                  <Ellipsis size={24} color={colorScheme === 'dark' ? '#fff' : '#000'} />
              }
              >
                <DropdownMenuItem 
                  label="Delete"
                  onPress={() => handleDeleteClass(classItem.id!)}
                />
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  label="Edit"
                />
              </DropdownMenu>
              
          </View>
        </View>
      ))}  */}
      
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} className="mt-4 mb-2 overflow-visible">
      <View className="flex flex-column gap-2">
        <View className="flex flex-row gap-2">

          {loading ? (
						<></>
					) : classes.map((classItem, index) => {
            if(index % 2 !== 0 ) return null;
            return (
              <Pressable key={index} onPress={()=>{router.push({
                pathname: '/(class)/[classid]',
                params: { classid: classItem.id }
              })}}>
                <View className='flex flex-row self-start bg-background p-4 border border-border rounded-lg w-56 text-ellipsis' style={{zIndex: 1}}>
                  <View className='flex flex-row justify-between'>
                    <View className='flex flex-row items-start gap-4'>
                      <View className='px-4 py-3 bg-violet-500 rounded-lg'>
                        <Text className='text-white'>C</Text>
                      </View>
                      <View>
                        <Text numberOfLines={1} className='font-medium overflow-hidden w-[105px] text-nowrap truncate'>{classItem.subject}</Text>
                        <Text numberOfLines={1} className='text-xs font-light w-[105px] text-nowrap truncate'>Prof. {classItem.instructors.first_name} {classItem.instructors.last_name}</Text>
                        <Text className='text-xs font-light mt-2 dark:text-gray-400 text-gray-600'>Code: {classItem.class_code}</Text>
                      </View>
                    </View> 
                      <DropdownMenu
                        trigger={
                          <Ellipsis size={24} color={colorScheme === 'dark' ? '#fff' : '#000'} />
                      }
                      >
                        <DropdownMenuItem 
                          label="Delete"
                          onPress={() => console.log()}
                        />
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          label="Edit"
                        />
                      </DropdownMenu>
                      
                  </View>
                </View>
              </Pressable>
            )
          })}

          <Pressable key={1} onPress={()=>{router.push({
            pathname: '/(class)/[classid]',
            params: { classid: "1" }
          })}}>
            <View className='flex flex-row self-start bg-background p-4 border border-border rounded-lg w-56 text-ellipsis' style={{zIndex: 1}}>
              <View className='flex flex-row justify-between'>
                <View className='flex flex-row items-start gap-4'>
                  <View className='px-4 py-3 bg-violet-500 rounded-lg'>
                    <Text className='text-white'>C</Text>
                  </View>
                  <View>
                    <Text numberOfLines={1} className='font-medium overflow-hidden w-[105px] text-nowrap truncate'>CE Comprehensive Course 1</Text>
                    <Text className='text-xs font-light'>Prof. Justin</Text>
                    <Text className='text-xs font-light mt-2 dark:text-gray-400 text-gray-600'>Code: 303</Text>
                  </View>
                </View> 
                  <DropdownMenu
                    trigger={
                      <Ellipsis size={24} color={colorScheme === 'dark' ? '#fff' : '#000'} />
                  }
                  >
                    <DropdownMenuItem 
                      label="Delete"
                      onPress={() => console.log()}
                    />
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      label="Edit"
                    />
                  </DropdownMenu>
                  
              </View>
            </View>
          </Pressable>

          
        </View>

        <View className="flex flex-row gap-2">
          {loading ? (
						<></>
					) : classes.map((classItem, index) => {
            if(index % 2 === 0 ) return null;
            return (
              <Pressable key={index} onPress={()=>{router.push({
                pathname: '/(class)/[classid]',
                params: { classid: classItem.id }
              })}}>
                <View className='flex flex-row self-start bg-background p-4 border border-border rounded-lg w-56 text-ellipsis'>
                  <View className='flex flex-row justify-between'>
                    <View className='flex flex-row items-start gap-4'>
                      <View className='px-4 py-3 bg-violet-500 rounded-lg'>
                        <Text className='text-white'>C</Text>
                      </View>
                      <View>
                        <Text numberOfLines={1} className='font-medium overflow-hidden w-[105px] text-nowrap truncate'>{classItem.subject}</Text>
                        <Text numberOfLines={1} className='text-xs font-light w-[105px] text-nowrap truncate'>Prof. {classItem.instructors.first_name} {classItem.instructors.last_name}</Text>
                        <Text className='text-xs font-light mt-2 dark:text-gray-400 text-gray-600'>Code: {classItem.class_code}</Text>
                      </View>
                    </View> 
                      <DropdownMenu
                        trigger={
                          <Ellipsis size={24} color={colorScheme === 'dark' ? '#fff' : '#000'} />
                      }
                      >
                        <DropdownMenuItem 
                          label="Delete"
                          onPress={() => console.log()}
                        />
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          label="Edit"
                        />
                      </DropdownMenu>
                      
                  </View>
                </View>
              </Pressable>
            )
          })}
        </View>
      </View>
      </ScrollView>

      {/* Modal */}
      <Modal
					visible={visible}
					transparent={true}
					animationType="fade"
				>
					<View className="flex-1 bg-black/50 flex flex-row justify-center items-center">
						<View className="bg-gray-100 dark:bg-neutral-900 p-4 w-[90%] rounded-lg">
							<View className="flex flex-row justify-between mb-4">
								<Text className="text-2xl font-semibold text-gray-900 dark:text-white">Join Classs</Text>
								<Pressable 
									className='rounded-full bg-foreground/20 p-2 active:opacity-70 active:scale-95 self-center' 
									onPress={()=> setVisible(false)}
								>
									<Icon as={X} className='size-4 text-background' />  
								</Pressable>
							</View>
							<View className="flex flex-col items-start">
								<Text className="mb-2">Class Code</Text>
								<TextInput 
									className="w-full bg-foreground/10 p-4 rounded-lg text-foreground mb-2"
									placeholder="e.g., Mathematics"
									placeholderTextColor={colorScheme === 'dark' ? '#6b7280' : '#9ca3af'}
									value={classCode}
									onChangeText={setClassCode}
								/>
								<Pressable 
									className="py-2 px-3 rounded-lg bg-foreground/10 active:opacity-75 self-end"
									onPress={handleJoinClass}
								>
									<Text>Continue</Text>
								</Pressable>
							</View>
						</View>
					</View>
				</Modal>
      
    </>
  )

}