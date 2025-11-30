"use client"

import { Animated, Pressable, ScrollView, TextInput, TouchableOpacity, View } from "react-native";
import { useColorScheme } from 'nativewind';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { Ellipsis, Plus, Scroll } from "lucide-react-native";
import { getClasses, subscribeToClasses, Class, addClass, deleteClass } from '@/lib/services/classService';
import { useEffect, useRef, useState } from "react";
import { Modal } from "./modal";
import { DropdownMenu, DropdownMenuItem, DropdownMenuSeparator} from "./ui/dropdown-menu";
import { router } from "expo-router";


export default function InstructorClassesComponent() {
  const { colorScheme } = useColorScheme();

  const [classes, setClasses] = useState<Class[]>([]);
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
      console.log('Fetching classes...');
      const fetchedClasses = await getClasses();
      console.log('Fetched:', fetchedClasses);
      setClasses(fetchedClasses);
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    try{
      const newClass = await addClass({
        name: "New Class",
        instructor: "New Guy",
        classCode: classCode,
      });
      console.log("Class added: ", newClass);
      setVisible(false);
    }catch (err){
      console.error("Failed to add class: ",err);
    }
  }

  const handleDeleteClass = async (classId: string) => {
    try{
      await deleteClass(classId);
      console.log("Class deleted: ",classId)
    } catch (err){
      console.error("Failed to delete class: ", err);
    }
  }

  return(
    <>
      <View>
				<View className='flex flex-row justify-between items-center w-full mb-2' >
					<Text className="font-semibold my-2">Your classes</Text>
				</View>

				<Pressable key={1} onPress={()=>{router.push({
					pathname: '/(class)/[classid]',
					params: { classid: "1" }
				})}}>
					<View className='bg-background p-4 border border-border rounded-lg'>
						<View className='flex flex-row justify-between'>
							<View className='flex flex-row items-start gap-4'>
								<View className='px-4 py-3 bg-violet-500 rounded-lg'>
									<Text className='text-white'>C</Text>
								</View>
								<View>
									<Text numberOfLines={1} className='font-medium w-[205px] text-nowrap truncate'>CE Comprehensive Course 1</Text>
									<Text className='text-xs font-light'>BSCE 4 Day</Text>
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
										onPress={() => handleDeleteClass("1")}
									/>
									<DropdownMenuSeparator />
									<DropdownMenuItem 
										label="Edit"
									/>
								</DropdownMenu>
								
						</View>
					</View>
				</Pressable>

				{/* Modal */}
				<Modal
					isOpen={visible}
					onClose={() => setVisible(false)}
					title="Join Class"
				>
					<ScrollView>
						<View className="flex flex-col items-start">
							<Text className="mb-2">Class Code</Text>
							<TextInput 
								className="w-full bg-foreground/10 p-4 rounded-lg text-foreground mb-2"
								placeholder="e.g., MATH303"
								placeholderTextColor={colorScheme === 'dark' ? '#6b7280' : '#9ca3af'}
								value={classCode}
								onChangeText={setClassCode}
							/>
							<Pressable 
								className="py-2 px-3 rounded-lg bg-foreground/10 active:opacity-75 self-end"
								onPress={handleJoin}
							>
								<Text>Join</Text>
							</Pressable>
						</View>
					</ScrollView>
				</Modal>
			</View>
      
    </>
  )

}