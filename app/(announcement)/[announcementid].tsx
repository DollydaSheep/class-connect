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
								<Icon as={Bell} className='size-8 text-foreground -ml-4' />			
								<View>
									<Text className='text-lg font-bold'>Midterm Exam Schedule</Text>
									<Text className='text-sm font-light pb-2'>Mathematics 101</Text>		
								</View>										
							</View>
            </>
          )
        }}
      />
			<ScrollView className='mb-12'>
      <View className='p-2 gap-3'>
        <View className='p-4 border border-border rounded-lg'>
					<Text className='font-semibold text-foreground'>Prof. Justin Nabunturan</Text>
					<Text className='font-light text-foreground'>October 5, 2025</Text>	
					<View className='border-t border-border my-2'></View>
					<Text>
						{`Dear Students,

I hope this message finds you well. I am writing to inform you about the upcoming midterm examination schedule for Mathematics 101.

The midterm exam will be held on October 15, 2024, from 2:00 PM to 4:00 PM in Room 305, Science Building.

Exam Coverage:

• Chapters 1-5: Limits, Continuity, and Derivatives  
• All topics discussed in lectures and practice problems  
• Application problems similar to homework assignments  

Exam Format:

• Part 1: Multiple Choice (20 questions - 40 points)  
• Part 2: Problem Solving (4 problems - 60 points)  
• Total: 100 points  

What to Bring:

• Valid student ID  
• Scientific calculator (non-programmable)  
• Blue or black pen  
• Pencil and eraser  

Important Reminders:

• Arrive at least 10 minutes before the exam starts  
• Review sessions will be held on October 12 and 13 from 4:00-5:30 PM  
• Office hours extended this week for questions  

Please reply to confirm your attendance. If you have any concerns or need special accommodations, contact me directly.

Good luck with your preparation!

Best regards,  
Prof. Sarah Johnson`}
					</Text>
				</View>
			</View>
			</ScrollView>
    </>
  )
}

