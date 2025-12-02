import { Pressable, StyleSheet, View, Image, ScrollView } from 'react-native'
import { Text } from '@/components/ui/text';
import React, { useEffect, useState } from 'react'
import { router, Stack, useLocalSearchParams } from 'expo-router'
import { THEME } from '@/lib/theme';
import { collection, query, where, getDocs, getDoc, doc, Timestamp } from "firebase/firestore";
import { db } from '@/lib/firebase';
import { Clock, Download, FileText, MessageSquare, Paperclip, Send, Upload, Zap } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';
import { useColorScheme } from 'nativewind';
import { TextInput } from 'react-native';
import { supabase } from '@/lib/supabase';



export default function TicketDetails() {

	const { colorScheme } = useColorScheme();

  const { activityid } = useLocalSearchParams();
  const [ticket, setTicket] = useState<any | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

	const [selected, setSelected] = useState(1);

	const [activity,setActivity] = useState<any>()

	const handleFetchActivity = async () => {
		try {
			setLoading(true);

			const {
				data: { user },
				error: authError,
			} = await supabase.auth.getUser();

			if (!user || authError) {
				throw new Error("Not authenticated");
			}

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
					class (
						subject
					)
				`)
				.eq("id", activityid)      // ✅ filter by instructor
				.order("due_date", { ascending: true });

			if (error) throw error;

			console.log("Fetched activities:", data);
			setActivity(data || []);
			console.log(activity)

		} catch (err: any) {
			console.error("Fetch activities failed:", err);
			alert(err.message || "Failed to fetch activities");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (activityid) {
			handleFetchActivity();
		}
	}, [activityid]);

	const formatMB = (bytes: number) => {
		return (bytes / (1024 * 1024)).toFixed(2);
	};

  return (
    <>
      <Stack.Screen 
        options={{
          
          headerTitle: () => (
            <>
              <View className='py-2'>
								{activity && (
									<>
										<Text className='text-xl font-bold'>{activity[0].activity_name}</Text>
										<Text className='text-sm font-light pb-2'>{activity[0].class.subject}</Text>
										<View className='flex flex-row gap-2'>
											<View className='flex flex-row gap-1 items-center'>
												<Clock 
													color={colorScheme === 'dark' ? THEME.dark.foreground : THEME.light.foreground}
													size={12}
												/>
												<Text className='text-xs font-light'>Due {new Date(activity[0].due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</Text>
											</View>
											<View className='flex flex-row gap-1 items-center'>
												<FileText 
													color={colorScheme === 'dark' ? THEME.dark.foreground : THEME.light.foreground}
													size={12}
												/>
												<Text className='text-xs font-light'>{activity[0].points} points</Text>
											</View>
										</View>
									</>
								)}
							</View>
            </>
          )
        }}
      />
			<ScrollView className='mb-12'>
      <View className='p-2 gap-3'>
        {activity && (
					<>
						<View className='p-4 border border-orange-600 bg-yellow-500/10 rounded-lg gap-1'>
							<View className='flex flex-row items-center gap-2'>
								<Clock 
									color={colorScheme === 'dark' ? THEME.dark.foreground : THEME.light.foreground}
									size={18}
								/>
								<Text>Due Date</Text>
							</View>
							<Text className=''>{new Date(activity[0].due_date).toDateString()}</Text>
						</View>
						<View className='p-4 border border-border rounded-lg'>
							<View className='flex flex-row items-center gap-2'>
								<FileText 
									color={colorScheme === 'dark' ? THEME.dark.foreground : THEME.light.foreground}
									size={18}
								/>
								<Text className='font-bold text-foreground'>Description</Text>
							</View>
							<Text className='mt-2 font-light'>
								{activity[0].description}
							</Text>
						</View>
						<View className='p-4 border border-border rounded-lg'>
							<View className='flex flex-row items-center gap-2'>
								<MessageSquare 
									color={colorScheme === 'dark' ? THEME.dark.foreground : THEME.light.foreground}
									size={18}
								/>
								<Text className='font-bold text-foreground'>Instructions</Text>
							</View>
							<Text className='mt-2 font-light'>
								{activity[0].instructions}
							</Text>
						</View>
						<View className='p-4 border border-border rounded-lg gap-2'>
							<View className='flex flex-row items-center gap-2'>
								<Paperclip 
									color={colorScheme === 'dark' ? THEME.dark.foreground : THEME.light.foreground}
									size={18}
								/>
								<Text className='font-bold text-foreground'>Attachments</Text>
							</View>
							{activity[0].file_attachments.map((file: any ,index: number) => (
								<View key={index} className='p-4 flex flex-row justify-between items-center border border-border rounded-lg'>
									<View className='flex flex-row gap-3'>
										<View className='p-2.5 bg-blue-300 rounded-lg'>
											<View>
												<Icon as={FileText} className='size-5 text-blue-600' />
											</View>
										</View>
										<View className='flex flex-column justify-center'>
											<Text numberOfLines={1} className='text-sm font-bold w-[170px] text-nowrap truncate'>{file.name}</Text>
											<Text className='text-sm'>{formatMB(file.size)} MB</Text>
										</View>
									</View>
									<Download 
										color={colorScheme === 'dark' ? THEME.dark.foreground : THEME.light.foreground}
									/>
								</View>
							))}
						</View>
						<View className='p-4 border border-border rounded-lg gap-2'>
							<View className='flex flex-row items-center gap-2'>
								<Upload 
									color={colorScheme === 'dark' ? THEME.dark.foreground : THEME.light.foreground}
									size={18}
								/>
								<Text className='font-bold text-foreground'>Your Submission</Text>
							</View>
							<View className='p-4 flex flex-row justify-center items-center border-2 border-border border-dashed rounded-lg'>
								<View className='flex flex-column items-center gap-3'>
									<Upload 
										color={colorScheme === 'dark' ? THEME.dark.foreground : THEME.light.foreground}
										size={32}
									/>
									<Text className='font-light'>Upload your work</Text>
									<Text className='text-xs font-light text-foreground/20'>Press to browse</Text>
								</View>
							</View>
							<Text className='text-sm py-1'>Add a comment (optional)</Text>
							<TextInput 
								className='p-4 pb-16 bg-white rounded-lg border border-border'
								placeholder='Write a note to your instructor...'
								placeholderTextColor={THEME.dark.border}
							/>
						</View>
						<Pressable>
							<View className='p-3 flex flex-row justify-center items-center gap-2 bg-violet-600 rounded-lg'>
								<Send 
									color={THEME.light.background}
									size={20}
								/>
								<Text className='font-bold text-white'>Turn in</Text>
							</View>
						</Pressable>
					</>
				)}
			</View>
			</ScrollView>
    </>
  )
}

