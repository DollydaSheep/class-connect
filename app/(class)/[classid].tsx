import { Pressable, StyleSheet, View, Image } from 'react-native'
import { Text } from '@/components/ui/text';
import React, { useEffect, useState } from 'react'
import { router, Stack, useLocalSearchParams } from 'expo-router'
import { THEME } from '@/lib/theme';
import { collection, query, where, getDocs, getDoc, doc, Timestamp } from "firebase/firestore";
import { db } from '@/lib/firebase';
import { FileText, Plus, Zap } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';
import { useColorScheme } from 'nativewind';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useUserRole';



export default function TicketDetails() {

	const { colorScheme } = useColorScheme();

  const { classid } = useLocalSearchParams();
  const [ticket, setTicket] = useState<any | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
	const [showAdd, setShowAdd] = useState(false);

	const [selected, setSelected] = useState(1);

	const { user } = useAuth();
	
	useEffect(() => {
		if (!user) {
			setRole(null);
			setLoading(false);
			return;
		}

		const fetchRole = async () => {
			setLoading(true);

			const { data, error } = await supabase
				.from("users")
				.select("role")
				.eq("id", user.id)
				.single();

			if (error) {
				console.error("Fetch role error:", error.message);
				setRole(null);
			} else {
				console.log(data.role)
				setRole(data.role);
			}

			setLoading(false);
		};

		fetchRole();
	}, [user]);

  return (
    <>
      <Stack.Screen 
        options={{
          
          headerTitle: () => (
            <>
              
            </>
          )
        }}
      />
      <View className='flex-1'>
				<View className='absolute bottom-16 right-8'>
					<Pressable 
						className='rounded-full bg-foreground p-2 active:opacity-70 active:scale-95 self-start' 
						onPress={()=>setShowAdd(!showAdd)}
					>
						<Icon as={Plus} className='size-8 text-background' />  
					</Pressable>
					{showAdd && (
						<View className='absolute -top-40 right-0'>
							<View className='bg-background border border-border rounded-lg'>
								<Text className='w-full p-3'>+ Announcement </Text>
								<View className='w-full border-t border-border'></View>
								<Text className='w-full p-3'>+ Activity</Text>
								<View className='w-full border-t border-border'></View>
								<Text className='w-full p-3'>+ Module</Text>
							</View>
						</View>
					)}
				</View>
				<View className='px-2 py-4 bg-foreground/5'>
					<Text className='text-xl font-medium'>CE Comprehensive Course 1</Text>
				</View>
				<View>
					<View className='flex flex-row justify-evenly'>
						<Pressable onPress={()=>setSelected(1)} className='grow'>
							<View className={`px-2 py-3 ${selected === 1 ? "rounded-t-md" : "bg-foreground/5"}`}>
								<Text className={`text-center text-xs`}>Activities</Text>
							</View>
						</Pressable>
						<Pressable onPress={()=>setSelected(2)} className='grow'>
							<View className={`px-2 py-3 ${selected === 2 ? "rounded-t-md" : "bg-foreground/5"}`}>
								<Text className={`text-center text-xs`}>Module</Text>
							</View>
						</Pressable>
						<Pressable onPress={()=>setSelected(3)} className='grow'>
							<View className={`px-2 py-3 ${selected === 3 ? "rounded-t-md" : "bg-foreground/5"}`}>
								<Text className={`text-center text-xs`}>Announcements</Text>
							</View>
						</Pressable>
					</View>
					<View className='p-2'>
						{selected === 1 && (
							<View className='bg-background border border-border p-4 rounded-lg'>
								<View className='flex flex-row justify-between'>
									<View className='flex flex-row items-start gap-4'>
										<View className='p-2.5 bg-orange-300 rounded-lg'>
											<View>
												<Icon as={FileText} className='size-5 text-orange-600' />
											</View>
										</View>
										<View>
											<Text className='font-medium'>Chapter 5 Quiz</Text>
											<Text className="text-xs font-light">Mathematics</Text>
											<Text className='text-sm font-medium dark:text-orange-400 text-orange-500'>Due Oct 8</Text>
										</View>
									</View>
									<View className="self-end">
										<Text className="text-xs px-3 py-2 rounded-full bg-green-400/50 text-foreground">Completed</Text>
									</View>
								</View>
							</View>
						)}
					</View>
				</View>
			</View>
    </>
  )
}

