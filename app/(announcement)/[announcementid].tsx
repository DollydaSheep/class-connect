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

	const [announcement, setAnnouncement] = useState<any>()

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
			setAnnouncement(data || []);
			console.log(announcement)

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

	const formatDateTime = (timestamp: string | Date) => {
		const date = new Date(timestamp);

		return date.toLocaleString("en-US", {
			weekday: "short",   // Wed
			month: "short",     // Oct
			day: "2-digit",     // 08
			year: "numeric",   // 2025
			hour: "numeric",   // 10
			minute: "2-digit", // 00
			hour12: true,      // AM/PM
		}).replace(",", " at"); // replaces first comma with " at"
	};

  return (
    <>
      <Stack.Screen 
        options={{
          
          headerTitle: () => (
            <>
              <View className='py-2 flex flex-row items-center gap-2'>				
								{announcement && (
									<>
										<Icon as={Bell} className='size-8 text-foreground -ml-4' />			
										<View>
											<Text className='text-lg font-bold'>{announcement[0].announcement_title}</Text>
											<Text className='text-sm font-light pb-2'>{announcement[0].class.subject}</Text>		
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
        {announcement && (
					<View className='p-4 border border-border rounded-lg'>
						<Text className='font-semibold text-foreground'>Prof. {announcement[0].users.first_name} {announcement[0].users.last_name}</Text>
						<Text className='font-light text-foreground text-sm'>{formatDateTime(announcement[0].created_at)}</Text>	
						<View className='border-t border-border my-2'></View>
						<Text>
							{`${announcement[0].content}`}
						</Text>
					</View>
				)}
			</View>
			</ScrollView>
    </>
  )
}

