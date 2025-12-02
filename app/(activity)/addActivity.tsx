import { Pressable, StyleSheet, View, Image, ScrollView } from 'react-native'
import { Text } from '@/components/ui/text';
import React, { useEffect, useState } from 'react'
import { router, Stack, useLocalSearchParams } from 'expo-router'
import { THEME } from '@/lib/theme';
import { collection, query, where, getDocs, getDoc, doc, Timestamp } from "firebase/firestore";
import { db } from '@/lib/firebase';
import { Calendar, ChevronDown, Clock, Download, FileText, MessageSquare, Paperclip, Plus, Send, Upload, Zap } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';
import { useColorScheme } from 'nativewind';
import { TextInput } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as DocumentPicker from 'expo-document-picker';


export default function TicketDetails() {

	const { colorScheme } = useColorScheme();

  const { activityid } = useLocalSearchParams();
  const [ticket, setTicket] = useState<any | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

	const [selected, setSelected] = useState(1);
	const [dueDate, setDueDate] = useState<Date | null>(null);
	const [openDatePicker, setOpenDatePicker] = useState(false);

	const [attachment, setAttachment] = useState<any[]>([])

	const handlePickFile = async () => {
		try {
			const result = await DocumentPicker.getDocumentAsync({
				multiple: false,
				copyToCacheDirectory: true,
			});

			if (result.canceled) return;

			const file = result.assets[0];

			console.log("Picked file:", file);

			const newFile = {
				uri: file.uri,
				name: file.name,
				type: file.mimeType,
				size: file.size,
			};

			setAttachment(prev => [...prev, newFile]);

		} catch (err) {
			console.error("File pick error:", err);
		}
	};

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
								<Text className='text-xl font-bold'>Add Activity</Text>
							</View>
            </>
          )
        }}
      />
			<ScrollView className='mb-12'>
      <View className='p-2 gap-3'>
				<View className='flex flex-col items-start px-4'>
					<Text className="mb-2">Activity Name</Text>
						<TextInput 
							className="w-full bg-foreground/10 p-3 rounded-lg text-foreground mb-2"
							placeholder="e.g., Activity Quiz"
							placeholderTextColor={colorScheme === 'dark' ? '#6b7280' : '#9ca3af'}
							
						/>
				</View>
        <View className='p-4 rounded-lg gap-4'>
					<View className='flex flex-row items-center gap-2'>
						<Clock 
							color={colorScheme === 'dark' ? THEME.dark.foreground : THEME.light.foreground}
							size={18}
						/>
						<Text>Due Date</Text>
					</View>
					<Pressable onPress={()=>setOpenDatePicker(true)}>
						<View className='px-4 flex flex-row justify-between'>
							<View className='flex flex-row gap-2'>
								<Icon as={Calendar} className='size-5'/>
								<Text className={`text-sm font-light ${dueDate ? "text-foreground" : "text-foreground/50"}`}>{dueDate ? dueDate.toDateString() : "+ Add Date"}</Text>
							</View>
							<Icon as={ChevronDown} className='size-4 text-foreground'/>
						</View>
					</Pressable>
					{openDatePicker && (
						<DateTimePicker
							value={dueDate ?? new Date()}
							mode="date"
							display="calendar"
							onChange={(event, selectedDate) => {
								setOpenDatePicker(false);
								if (selectedDate && event.type === 'set') {setDueDate(selectedDate);console.log(selectedDate)};
							}}
						/>
					)}
					
				</View>
				<View className='p-4 border border-border rounded-lg gap-3'>
					<View className='flex flex-row items-center gap-2'>
						<FileText 
							color={colorScheme === 'dark' ? THEME.dark.foreground : THEME.light.foreground}
							size={18}
						/>
						<Text className='font-bold text-foreground'>Description</Text>
					</View>
					<TextInput 
						multiline
						textAlignVertical="top"
						className="w-full bg-foreground/10 p-3 rounded-lg text-foreground mb-2"
						placeholder="e.g., Activity Quiz"
						placeholderTextColor={colorScheme === 'dark' ? '#6b7280' : '#9ca3af'}
						
					/>
				</View>
				<View className='p-4 border border-border rounded-lg gap-3'>
					<View className='flex flex-row items-center gap-2'>
						<MessageSquare 
							color={colorScheme === 'dark' ? THEME.dark.foreground : THEME.light.foreground}
							size={18}
						/>
						<Text className='font-bold text-foreground'>Instructions</Text>
					</View>
					<TextInput 
						multiline
						textAlignVertical="top"
						className="w-full bg-foreground/10 p-3 rounded-lg text-foreground mb-2"
						placeholder="e.g., Activity Quiz"
						placeholderTextColor={colorScheme === 'dark' ? '#6b7280' : '#9ca3af'}
						
					/>
				</View>
				<View className='p-4 border border-border rounded-lg gap-2'>
					<View className='flex flex-row items-center gap-2'>
						<Paperclip 
							color={colorScheme === 'dark' ? THEME.dark.foreground : THEME.light.foreground}
							size={18}
						/>
						<Text className='font-bold text-foreground'>Attachments</Text>
					</View>
					{attachment.map((file, index) => (
						<View key={index} className='p-4 flex flex-row justify-between items-center border border-border rounded-lg'>
							<View className='flex flex-row gap-3'>
								<View className='p-2.5 bg-blue-300 rounded-lg'>
									<View>
										<Icon as={FileText} className='size-5 text-blue-600' />
									</View>
								</View>
								<View className='flex flex-column justify-center'>
									<Text numberOfLines={1} className='text-sm font-bold w-[200px] text-nowrap truncate'>{file.name}</Text>
									<Text className='text-sm'>{formatMB(file.size)} MB</Text>
								</View>
							</View>
						</View>
					))}
					<Pressable className='active:opacity-75' onPress={handlePickFile}>
						<View className='mt-2 flex flex-row items-center gap-2' style={{zIndex: 1}}>
							<View className='p-1.5 bg-foreground/20 rounded-full self-center'>
								<View>
									<Icon as={Plus} className='size-3 text-white' />
								</View>
							</View>
								<Text className='text-sm'>Add Attachments</Text>
						</View>
					</Pressable>
					
				</View>		
				<Pressable>
					<View className='p-3 flex flex-row justify-center items-center gap-2 bg-violet-600 rounded-lg'>
						<Send 
							color={THEME.light.background}
							size={20}
						/>
						<Text className='font-bold text-white'>Submit Assignment</Text>
					</View>
				</Pressable>
			</View>
			</ScrollView>
    </>
  )
}

