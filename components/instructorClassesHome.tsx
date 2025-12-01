"use client"

import { Animated, Modal, Pressable, ScrollView, TextInput, TouchableOpacity, View } from "react-native";
import { useColorScheme } from 'nativewind';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { Ellipsis, Plus, Scroll, X } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { DropdownMenu, DropdownMenuItem, DropdownMenuSeparator} from "./ui/dropdown-menu";
import { router } from "expo-router";
import { supabase } from "@/lib/supabase";


export default function InstructorClassesComponent() {
  const { colorScheme } = useColorScheme();

	const [subject, setSubject] = useState('');
	const [section, setSection] = useState('');
	const [description, setDescription] = useState('');

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
		try {
			setLoading(true);

			const {
				data: { user },
				error: authError,
			} = await supabase.auth.getUser();

			if (authError || !user) {
				throw new Error("Not authenticated");
			}

			const { data, error } = await supabase
				.from("class")
				.select(`
					id,
					subject,
					class_section,
					description,
					class_code,
					created_at,
					instructor_id,
					users (
						first_name,
						last_name
					)
				`)
				.eq("instructor_id", user.id) // only this instructor's classes
				.order("created_at", { ascending: false });

			if (error) {
				throw new Error(error.message);
			}

			setClasses(data || []);
		} catch (err: any) {
			console.error("Failed to fetch classes:", err);
			alert(err.message || "Failed to fetch classes");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		handleFetchClasses();
	}, []);

	const generateClassCode = () => {
		return Math.random()
			.toString(36)
			.substring(2, 9)
			.toUpperCase(); // e.g. "A9F3K2Q"
	};

  const handleAddClass = async () => {
		try {
			if (!subject || !section || !description ) {
				alert("Please fill in all required fields.");
				return;
			}

			setLoading(true);

			// ✅ Get authenticated user
			const {
				data: { user },
				error: authError,
			} = await supabase.auth.getUser();

			if (authError || !user) {
				throw new Error("Not authenticated");
			}

			// ✅ Insert directly into Supabase
			const { data, error } = await supabase
				.from("class")
				.insert([
					{
						instructor_id: user.id,
						subject: subject.trim(),
						class_section: section.trim(),
						description: description.trim(),
						class_code: generateClassCode(),
					},
				])
				.select()
				.single();

			if (error) {
				throw new Error(error.message);
			}

			console.log("Class added:", data);

			// ✅ Reset form
			setSubject("");
			setSection("");
			setDescription("");
			setClassCode("");
			setVisible(false);

			// ✅ Refresh list
			await handleFetchClasses();

		} catch (err: any) {
			console.error("Failed to add class:", err);
			alert(err.message || "Failed to create class");
		} finally {
			setLoading(false);
		}
	};

  // const handleDeleteClass = async (classId: string) => {
  //   try{
  //     await deleteClass(classId);
  //     console.log("Class deleted: ",classId)
  //   } catch (err){
  //     console.error("Failed to delete class: ", err);
  //   }
  // }

  return(
    <>
      <View>
				<View className='flex flex-row justify-between items-center w-full mb-2' >
					<Text className="font-semibold my-2">Your classes</Text>
					<Pressable 
						className='rounded-full bg-foreground p-2 active:opacity-70 active:scale-95' 
						onPress={()=> setVisible(true)}
					>
						<Icon as={Plus} className='size-6 text-background' />  
					</Pressable>
				</View>

				<View className="gap-3">
					{loading ? (
						<></>
					) : classes.map((classItem, index) => (
						<Pressable key={index} onPress={()=>{router.push({
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
											<Text numberOfLines={1} className='font-medium w-[205px] text-nowrap truncate'>{classItem.subject}</Text>
											<Text className='text-xs font-light'>{classItem.class_section}</Text>
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
					))} 

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

				{/* Modal */}
				<Modal
					visible={visible}
					transparent={true}
					animationType="fade"
				>
					<View className="flex-1 bg-black/50 flex flex-row justify-center items-center">
						<View className="bg-gray-100 dark:bg-neutral-900 p-4 w-[90%] rounded-lg">
							<View className="flex flex-row justify-between mb-4">
								<Text className="text-2xl font-semibold text-gray-900 dark:text-white">Add Classs</Text>
								<Pressable 
									className='rounded-full bg-foreground/20 p-2 active:opacity-70 active:scale-95 self-center' 
									onPress={()=> setVisible(false)}
								>
									<Icon as={X} className='size-4 text-background' />  
								</Pressable>
							</View>
							<View className="flex flex-col items-start">
								<Text className="mb-2">Subject</Text>
								<TextInput 
									className="w-full bg-foreground/10 p-4 rounded-lg text-foreground mb-2"
									placeholder="e.g., Mathematics"
									placeholderTextColor={colorScheme === 'dark' ? '#6b7280' : '#9ca3af'}
									value={subject}
									onChangeText={setSubject}
								/>
								<Text className="mb-2">Class Section</Text>
								<TextInput 
									className="w-full bg-foreground/10 p-4 rounded-lg text-foreground mb-2"
									placeholder="e.g., BSCE 4 Day"
									placeholderTextColor={colorScheme === 'dark' ? '#6b7280' : '#9ca3af'}
									value={section}
									onChangeText={setSection}
								/>
								<Text className="mb-2">Description</Text>
								<TextInput 
									className="w-full bg-foreground/10 p-4 pb-12 rounded-lg text-foreground mb-2"
									placeholder="A Short Description about this class..."
									placeholderTextColor={colorScheme === 'dark' ? '#6b7280' : '#9ca3af'}
									numberOfLines={2}
									value={description}
									onChangeText={setDescription}
								/>
								<Pressable 
									className="py-2 px-3 rounded-lg bg-foreground/10 active:opacity-75 self-end"
									onPress={handleAddClass}
								>
									<Text>Continue</Text>
								</Pressable>
							</View>
						</View>
					</View>
				</Modal>
				{/* <Modal
					isOpen={visible}
					onClose={() => setVisible(false)}
					title="Add Class"
				>
					<ScrollView>
						<View className="flex flex-col items-start">
							<Text className="mb-2">Subject</Text>
							<TextInput 
								className="w-full bg-foreground/10 p-4 rounded-lg text-foreground mb-2"
								placeholder="e.g., Mathematics"
								placeholderTextColor={colorScheme === 'dark' ? '#6b7280' : '#9ca3af'}
								value={classCode}
								onChangeText={setClassCode}
							/>
							<Text className="mb-2">Class Section</Text>
							<TextInput 
								className="w-full bg-foreground/10 p-4 rounded-lg text-foreground mb-2"
								placeholder="e.g., BSCE 4 Day"
								placeholderTextColor={colorScheme === 'dark' ? '#6b7280' : '#9ca3af'}
								value={classCode}
								onChangeText={setClassCode}
							/>
							<Text className="mb-2">Description</Text>
							<TextInput 
								className="w-full bg-foreground/10 p-4 pb-12 rounded-lg text-foreground mb-2"
								placeholder="A Short Description about this class..."
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
				</Modal> */}
			</View>
      
    </>
  )

}