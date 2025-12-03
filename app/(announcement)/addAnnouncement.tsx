import { Pressable, StyleSheet, View, Image, ScrollView } from 'react-native'
import { Text } from '@/components/ui/text';
import React, { useEffect, useState } from 'react'
import { router, Stack, useLocalSearchParams } from 'expo-router'
import { THEME } from '@/lib/theme';
import { collection, query, where, getDocs, getDoc, doc, Timestamp } from "firebase/firestore";
import { db } from '@/lib/firebase';
import { Bell, Clock, Download, FileText, MessageSquare, Paperclip, Send, Upload, Zap } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';
import { useColorScheme } from 'nativewind';
import { TextInput } from 'react-native';
import { supabase } from '@/lib/supabase';



export default function TicketDetails() {

	const { colorScheme } = useColorScheme();

  const { announcementid } = useLocalSearchParams();
  const [ticket, setTicket] = useState<any | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

	const [selected, setSelected] = useState(1);

	const [activity,setActivity] = useState<any>()

	// const handleFetchActivity = async () => {
	// 	try {
	// 		setLoading(true);

	// 		const {
	// 			data: { user },
	// 			error: authError,
	// 		} = await supabase.auth.getUser();

	// 		if (!user || authError) {
	// 			throw new Error("Not authenticated");
	// 		}

	// 		const { data, error } = await supabase
	// 			.from("class_activity")
	// 			.select(`
	// 				id,
	// 				class_id,
	// 				instructor_id,
	// 				activity_name,
	// 				description,
	// 				instructions,
	// 				points,
	// 				due_date,
	// 				file_attachments,
	// 				created_at,
	// 				class (
	// 					subject
	// 				)
	// 			`)
	// 			.eq("id", activityid)      // ✅ filter by instructor
	// 			.order("due_date", { ascending: true });

	// 		if (error) throw error;

	// 		console.log("Fetched activities:", data);
	// 		setActivity(data || []);
	// 		console.log(activity)

	// 	} catch (err: any) {
	// 		console.error("Fetch activities failed:", err);
	// 		alert(err.message || "Failed to fetch activities");
	// 	} finally {
	// 		setLoading(false);
	// 	}
	// };

	// useEffect(() => {
	// 	if (activityid) {
	// 		handleFetchActivity();
	// 	}
	// }, [activityid]);

	const formatMB = (bytes: number) => {
		return (bytes / (1024 * 1024)).toFixed(2);
	};

  return (
    <>
      <Stack.Screen 
        options={{
          
          headerTitle: () => (
            <>
              <View className='py-2 flex flex-row items-center gap-2'>				
								<Text className='text-lg font-bold'>Add Announcement</Text>								
							</View>
            </>
          )
        }}
      />
			<ScrollView className='mb-12'>
      <View className='p-2 gap-3'>
        <View className='flex flex-col items-start px-4'>
					<Text className="mb-2">Announcement Title</Text>
					<TextInput 
						className="w-full bg-foreground/10 p-3 rounded-lg text-foreground mb-2"
						placeholder="e.g., Introduction to Mathematics"
						placeholderTextColor={colorScheme === 'dark' ? '#6b7280' : '#9ca3af'}
						// value={moduleName}
						// onChangeText={setModuleName}
					/>
				</View>
				<View className='p-4 border border-border rounded-lg gap-3'>
					<View className='flex flex-row items-center gap-2'>
						<FileText 
							color={colorScheme === 'dark' ? THEME.dark.foreground : THEME.light.foreground}
							size={18}
						/>
						<Text className='font-bold text-foreground'>Content</Text>
					</View>
					<TextInput 
						multiline
						textAlignVertical="top"
						className="w-full bg-foreground/10 p-3 rounded-lg text-foreground mb-2 h-40"
						placeholder="e.g., Activity Quiz"
						placeholderTextColor={colorScheme === 'dark' ? '#6b7280' : '#9ca3af'}
						// value={description}
						// onChangeText={setDescription}
					/>
				</View>
				<Pressable onPress={()=>console.log()}>
					<View className='p-3 flex flex-row justify-center items-center gap-2 bg-violet-600 rounded-lg'>
						<Send 
							color={THEME.light.background}
							size={20}
						/>
						<Text className='font-bold text-white w-[160px]'>Add Announcement</Text>
					</View>
				</Pressable>
			</View>
			</ScrollView>
    </>
  )
}

