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
import { supabase } from '@/lib/supabase';



export default function ModuleDetails() {

	const { colorScheme } = useColorScheme();

  const { moduleid } = useLocalSearchParams();
  const [ticket, setTicket] = useState<any | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

	const [selected, setSelected] = useState(1);

	const [module, setModule] = useState<any>();

	const handleFetchModule = async () => {
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
				.from("class_module")
				.select(`
					id,
					class_id,
					instructor_id,
					module_name,
					module_overview,
					file_attachments,
					created_at,
					class (
						subject
					)
				`)
				.eq("id", moduleid)      // ✅ filter by instructor
				

			if (error) throw error;

			console.log("Fetched module:", data);
			setModule(data || []);
			console.log(module)

		} catch (err: any) {
			console.error("Fetch module failed:", err);
			alert(err.message || "Failed to fetch module");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (moduleid) {
			handleFetchModule();
		}
	}, [moduleid]);

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
								{module && (
									<>
										<Text className='text-xl font-bold'>{module[0].module_name}</Text>
										<Text className='text-sm font-light pb-2'>{module[0].class.subject}</Text>
										<View className='flex flex-row gap-2'>
											<View className='flex flex-row gap-1 items-center'>
												<FileText 
													color={colorScheme === 'dark' ? THEME.dark.foreground : THEME.light.foreground}
													size={12}
												/>
												<Text className='text-xs font-light'>{module[0].file_attachments.length} learning material{module[0].file_attachments.length > 1 ? "s" : ""}</Text>
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
				{module && (
					<>
						<View className='p-4 border border-border rounded-lg'>
							<View className='flex flex-row items-center gap-2'>
								<BookOpen 
									color={colorScheme === 'dark' ? THEME.dark.foreground : THEME.light.foreground}
									size={18}
								/>
								<Text className='font-bold text-foreground'>Module Overview</Text>
							</View>
							<Text className='mt-2 font-light'>
								{module[0].module_overview}
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
							{module[0].file_attachments.map((file: any ,index: number) => (
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
					</>
				)}
			</View>
			</ScrollView>
    </>
  )
}

