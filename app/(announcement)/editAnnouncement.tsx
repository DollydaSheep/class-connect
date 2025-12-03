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

  const { announcementid, classid } = useLocalSearchParams();
  const [ticket, setTicket] = useState<any | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

	const [selected, setSelected] = useState(1);

	const [announcementTitle, setAnnouncementTitle] = useState('');
	const [content, setContent] = useState('');
	const [activity,setActivity] = useState<any>()

	const handleUpdateAnnouncement = async () => {
		try {
			if (!announcementTitle || !content) {
				alert("Announcement Title and content are required");
				return;
			}

			setLoading(true);

			const {
				data: { user },
				error: authError,
			} = await supabase.auth.getUser();

			if (!user || authError) {
				throw new Error("Not authenticated");
			}

			const { data, error } = await supabase
				.from("class_announcement")
				.update({
					announcement_title: announcementTitle.trim(),
					content: content.trim(),
					// updated_at: new Date().toISOString(), // ✅ add this column if not yet present
				})
				.eq("id", announcementid)              // ✅ target specific announcement
				.eq("instructor_id", user.id)          // ✅ security check (optional but recommended)
				.select()
				.single();

			if (error) throw error;

			console.log("Announcement updated:", data);
			alert("Announcement updated successfully ✅");

			// ✅ Reset form
			setAnnouncementTitle('');
			setContent('');

			router.back();

		} catch (err: any) {
			console.error("Update announcement failed:", err);
			alert(err.message || "Failed to update announcement");
		} finally {
			setLoading(false);
		}
	};

	const handleFetchAnnouncement = async () => {
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
				.from("class_announcement")
				.select(`
					id,
					class_id,
					instructor_id,
					announcement_title,
					content,
					created_at,
					users (
						first_name,
						last_name
					),
					class (
						subject
					)
				`)
				.eq("id", announcementid)      // ✅ filter by instructor

			if (error) throw error;

			console.log("Fetched announcement:", data);
			setAnnouncementTitle(data[0].announcement_title)
			setContent(data[0].content)

		} catch (err: any) {
			console.error("Fetch announcement failed:", err);
			alert(err.message || "Failed to fetch announcement");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (announcementid) {
			handleFetchAnnouncement();
		}
	}, [announcementid]);

  return (
    <>
      <Stack.Screen 
        options={{
          
          headerTitle: () => (
            <>
              <View className='py-2 flex flex-row items-center gap-2'>				
								<Text className='text-lg font-bold'>Edit Announcement</Text>								
							</View>
            </>
          )
        }}
      />
			<ScrollView className='mb-12'>
      <View className='p-2 gap-3'>
        {!loading && (
					<>
						<View className='flex flex-col items-start px-4'>
							<Text className="mb-2">Announcement Title</Text>
							<TextInput 
								className="w-full bg-foreground/10 p-3 rounded-lg text-foreground mb-2"
								placeholder="e.g., Introduction to Mathematics"
								placeholderTextColor={colorScheme === 'dark' ? '#6b7280' : '#9ca3af'}
								value={announcementTitle}
								onChangeText={setAnnouncementTitle}
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
								value={content}
								onChangeText={setContent}
							/>
						</View>
						<Pressable onPress={handleUpdateAnnouncement}>
							<View className='p-3 flex flex-row justify-center items-center gap-2 bg-violet-600 rounded-lg'>
								<Send 
									color={THEME.light.background}
									size={20}
								/>
								<Text className='font-bold text-white w-[160px]'>Edit Announcement</Text>
							</View>
						</Pressable>
					</>
				)}
			</View>
			</ScrollView>
    </>
  )
}

