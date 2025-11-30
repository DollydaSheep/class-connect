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



export default function TicketDetails() {

	const { colorScheme } = useColorScheme();

  const { activityid } = useLocalSearchParams();
  const [ticket, setTicket] = useState<any | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

	const [selected, setSelected] = useState(1);

  return (
    <>
      <Stack.Screen 
        options={{
          
          headerTitle: () => (
            <>
              <View className='py-2'>
								<Text className='text-xl font-bold'>Chapter 5 Quiz</Text>
								<Text className='text-sm font-light pb-2'>Mathematics</Text>
								<View className='flex flex-row gap-2'>
									<View className='flex flex-row gap-1 items-center'>
										<Clock 
											color={colorScheme === 'dark' ? THEME.dark.foreground : THEME.light.foreground}
											size={12}
										/>
										<Text className='text-xs font-light'>Due Oct 8</Text>
									</View>
									<View className='flex flex-row gap-1 items-center'>
										<FileText 
											color={colorScheme === 'dark' ? THEME.dark.foreground : THEME.light.foreground}
											size={12}
										/>
										<Text className='text-xs font-light'>50 points</Text>
									</View>
								</View>
							</View>
            </>
          )
        }}
      />
			<ScrollView className='mb-12'>
      <View className='p-2 gap-3'>
        <View className='p-4 border border-orange-600 bg-yellow-500/10 rounded-lg gap-1'>
					<View className='flex flex-row items-center gap-2'>
						<Clock 
							color={colorScheme === 'dark' ? THEME.dark.foreground : THEME.light.foreground}
							size={18}
						/>
						<Text>Due Date</Text>
					</View>
					<Text className=''>October 8, 2025 at 11:59 PM</Text>
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
						Complete the quiz on Derivatives and their applications. This quiz covers sections 5.1 to 5.4 of your textbook.
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
						Answer all 20 multiple choice questions. You have 45 minutes to complete this quiz once you start. Make sure you have a stable internet connection.
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
					<View className='p-4 flex flex-row justify-between items-center border border-border rounded-lg'>
						<View className='flex flex-row gap-3'>
							<View className='p-2.5 bg-blue-300 rounded-lg'>
                <View>
                  <Icon as={FileText} className='size-5 text-blue-600' />
                </View>
              </View>
							<View className='flex flex-column justify-center'>
								<Text className='text-sm font-bold'>Study Guide.pdf</Text>
								<Text className='text-sm'>2.3 MB</Text>
							</View>
						</View>
						<Download 
							color={colorScheme === 'dark' ? THEME.dark.foreground : THEME.light.foreground}
						/>
					</View>
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
						<Text className='font-bold text-white'>Submit Assignment</Text>
					</View>
				</Pressable>
			</View>
			</ScrollView>
    </>
  )
}

