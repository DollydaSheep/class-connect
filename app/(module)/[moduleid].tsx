import { Pressable, StyleSheet, View, Image, ScrollView } from 'react-native'
import { Text } from '@/components/ui/text';
import React, { useEffect, useState } from 'react'
import { router, Stack, useLocalSearchParams } from 'expo-router'
import { THEME } from '@/lib/theme';
import { collection, query, where, getDocs, getDoc, doc, Timestamp } from "firebase/firestore";
import { db } from '@/lib/firebase';
import { Book, BookOpen, Clock, Download, FileText, MessageSquare, Paperclip, Send, Upload, Zap } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';
import { useColorScheme } from 'nativewind';
import { TextInput } from 'react-native';



export default function ModuleDetails() {

	const { colorScheme } = useColorScheme();

  const { moduleid } = useLocalSearchParams();
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
								<Text className='text-xl font-bold'>Week 1 Module</Text>
								<Text className='text-sm font-light pb-2'>CE Comprehension Course 1</Text>
								<View className='flex flex-row gap-2'>
									<View className='flex flex-row gap-1 items-center'>
										<FileText 
											color={colorScheme === 'dark' ? THEME.dark.foreground : THEME.light.foreground}
											size={12}
										/>
										<Text className='text-xs font-light'>2 learning materials</Text>
									</View>
								</View>
							</View>
            </>
          )
        }}
      />
			<ScrollView className='mb-12'>
      <View className='p-2 gap-3'>
				<View className='p-4 border border-border rounded-lg'>
					<View className='flex flex-row items-center gap-2'>
						<BookOpen 
							color={colorScheme === 'dark' ? THEME.dark.foreground : THEME.light.foreground}
							size={18}
						/>
						<Text className='font-bold text-foreground'>Module Overview</Text>
					</View>
					<Text className='mt-2 font-light'>
						This module introduces fundamental concepts of calculus including limits and continuity.
					</Text>
				</View>
				<View className='p-4 border border-border rounded-lg gap-2'>
					<View className='flex flex-row items-center gap-2'>
						<FileText 
							color={colorScheme === 'dark' ? THEME.dark.foreground : THEME.light.foreground}
							size={18}
						/>
						<Text className='font-bold text-foreground'>Learning Materials</Text>
					</View>
					<View className='p-4 flex flex-row justify-between items-center border border-border rounded-lg'>
						<View className='flex flex-row gap-3'>
							<View className='p-2.5 bg-blue-300 rounded-lg'>
                <View>
                  <Icon as={FileText} className='size-5 text-blue-600' />
                </View>
              </View>
							<View className='flex flex-column justify-center'>
								<Text className='text-sm font-bold'>Lecture Slides.pdf</Text>
								<Text className='text-sm'>2.3 MB</Text>
							</View>
						</View>
						<Download 
							color={colorScheme === 'dark' ? THEME.dark.foreground : THEME.light.foreground}
						/>
					</View>
					<View className='p-4 flex flex-row justify-between items-center border border-border rounded-lg'>
						<View className='flex flex-row gap-3'>
							<View className='p-2.5 bg-blue-300 rounded-lg'>
                <View>
                  <Icon as={FileText} className='size-5 text-blue-600' />
                </View>
              </View>
							<View className='flex flex-column justify-center'>
								<Text className='text-sm font-bold'>Practice Problems.pdf</Text>
								<Text className='text-sm'>1.8 MB</Text>
							</View>
						</View>
						<Download 
							color={colorScheme === 'dark' ? THEME.dark.foreground : THEME.light.foreground}
						/>
					</View>
				</View>
			</View>
			</ScrollView>
    </>
  )
}

