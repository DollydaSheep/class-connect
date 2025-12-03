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
import Skeletonbox from '@/components/skeleton/skeletonbox';



export default function ClassDetails() {

	const { colorScheme } = useColorScheme();

  const { classid, instructorFirstName, instructorLastName, subject, classSection } = useLocalSearchParams();
  const [ticket, setTicket] = useState<any | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
	const [showAdd, setShowAdd] = useState(false);
	const [showEmpty, setShowEmpty] = useState(false);

	const [selected, setSelected] = useState(1);

	const [activities, setActivities] = useState<any[]>([]);
	const [modules, setModules] = useState<any[]>([]);
	const [announcements, setAnnouncements] = useState<any[]>([]);

	const { user } = useAuth();

	const handleFetchAnnouncements = async () => {
		try {
			setLoading(true);
			setShowEmpty(false); // ✅ Reset empty state

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
						subject,
						class_section
					)
				`)
				.eq("class_id", String(classid))
				.order("created_at", { ascending: true });

			if (error) throw error;

			console.log("Fetched announcements:", data);
			setModules(data || []);

			// ✅ Show empty message after 2 seconds if no activities
			if (!data || data.length === 0) {
				setTimeout(() => {
					setShowEmpty(true);
					setLoading(false);
				}, 2000);
			} else {
				setLoading(false)
			}

		} catch (err: any) {
			console.error("Fetch announcements failed:", err);
			alert(err.message || "Failed to fetch announcements");
		} finally {
			
		}
	};

	const handleFetchModules = async () => {
		try {
			setLoading(true);
			setShowEmpty(false); // ✅ Reset empty state

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
					users (
						first_name,
						last_name
					),
					class (
						subject,
						class_section
					)
				`)
				.eq("class_id", String(classid))
				.order("created_at", { ascending: true });

			if (error) throw error;

			console.log("Fetched modules:", data);
			setModules(data || []);

			// ✅ Show empty message after 2 seconds if no activities
			if (!data || data.length === 0) {
				setTimeout(() => {
					setShowEmpty(true);
					setLoading(false);
				}, 2000);
			} else {
				setLoading(false)
			}

		} catch (err: any) {
			console.error("Fetch modules failed:", err);
			alert(err.message || "Failed to fetch modules");
		} finally {
			
		}
	};

	const handleFetchActivities = async () => {
		try {
			setLoading(true);
			setShowEmpty(false); // ✅ Reset empty state

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
					status,
					class (
						subject
					)
				`)
				.eq("class_id", String(classid))
				.order("due_date", { ascending: true });

			if (error) throw error;

			console.log("Fetched activities:", data);
			setActivities(data || []);

			// ✅ Show empty message after 2 seconds if no activities
			if (!data || data.length === 0) {
				setTimeout(() => {
					setShowEmpty(true);
					setLoading(false);
				}, 2000);
			} else {
				setLoading(false)
			}

		} catch (err: any) {
			console.error("Fetch activities failed:", err);
			alert(err.message || "Failed to fetch activities");
		} finally {
			
		}
	};

	useEffect(() => {
		setActivities([]);
		setModules([]);
		if (classid) {
			if(selected === 1){
				handleFetchActivities();
			} else if(selected === 2){
				handleFetchModules();
			} else if(selected === 3){
				handleFetchAnnouncements();
			}
		}
	}, [classid, selected]);
	
	useEffect(() => {
		if (!user) {
			setRole(null);
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
				{role === "instructor" && (
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
									<Pressable onPress={()=>{router.push({
										pathname: '/(announcement)/addAnnouncement',
										params: { classid: classid }
									});setShowAdd(false)}}>
										<Text className='w-full p-3'>+ Announcement </Text>
									</Pressable>
									<View className='w-full border-t border-border'></View>
									<Pressable onPress={()=>{router.push({
										pathname: '/(activity)/addActivity',
										params: { classid: classid }
									});setShowAdd(false)}}>
										<Text className='w-full p-3'>+ Activity</Text>
									</Pressable>
									<View className='w-full border-t border-border'></View>
									<Pressable onPress={()=>{router.push({
										pathname: '/(module)/addModule',
										params: { classid: classid }
									});setShowAdd(false)}}>
										<Text className='w-full p-3'>+ Module</Text>
									</Pressable>							
								</View>
							</View>
						)}
					</View>
				)}
				<View className='px-2 py-4 bg-foreground/5'>
					<Text className='text-xl font-medium'>{subject}</Text>
					{role === "instructor" ? (
						<Text className='text-sm font-light'>{classSection}</Text>
					) : (
						<Text className='text-sm font-light'>{instructorFirstName} {instructorLastName}</Text>
					)}
					
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
					<View className='p-2 gap-2'>
						{selected === 1 && (
							<>
								{loading && (
									<View className='gap-2 p-2'>
										<Skeletonbox height={80} />
										<Skeletonbox height={80} />
										<Skeletonbox height={80} />
									</View>
								)}
								{activities.length === 0 && !loading && showEmpty && (
									<View className='p-2'>
										<Text className='text-sm font-light'>No activities for this class.</Text>
									</View>
								)}
								{activities.map((act, index) => (
									<Pressable key={act.id || index} onPress={()=>router.push({
										pathname: '/(activity)/[activityid]',
										params: { activityid: act.id }
									})}>
										<View className='bg-background border border-border p-4 rounded-lg'>
											<View className='flex flex-row justify-between'>
												<View className='flex flex-row items-start gap-4'>
													<View className='p-2.5 bg-orange-300 rounded-lg'>
														<View>
															<Icon as={FileText} className='size-5 text-orange-600' />
														</View>
													</View>
													<View>
														<Text className='font-medium'>{act.activity_name}</Text>
														<Text className="text-xs font-light">{act.class.subject}</Text>
														<Text className='text-sm font-medium dark:text-orange-400 text-orange-500'>
															Due {new Date(act.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
														</Text>
													</View>
												</View>
												{role === 'student' && (
													<View className="self-end">
														<Text className={`text-xs px-3 py-2 rounded-full ${act.status === 'Pending' ? "bg-orange-500/50" : act.status === 'Completed' ? "bg-green-400/50" : ""} text-foreground`}>
															{act.status}
														</Text>
													</View>
												)}
											</View>
										</View>
									</Pressable>
								))}
							</>
						)}
						{selected === 2 && (
							<>
								{loading && (
									<View className='gap-2 p-2'>
										<Skeletonbox height={80} />
										<Skeletonbox height={80} />
										<Skeletonbox height={80} />
									</View>
								)}
								{modules.length === 0 && !loading && showEmpty && (
									<View className='p-2'>
										<Text className='text-sm font-light'>No modules for this class.</Text>
									</View>
								)}
								{modules.map((module,index)=>(
									<Pressable key={index}
										onPress={()=>{router.push({
										pathname: '/(module)/[moduleid]',
										params: { moduleid: module.id }
									})}}>
										<View className='bg-background border border-border p-4 rounded-lg'>
											<View className='flex flex-row justify-between'>
												<View className='flex flex-row items-start gap-4'>
													<View className='p-2.5 bg-orange-300 rounded-lg'>
														<View>
															<Icon as={FileText} className='size-5 text-orange-600' />
														</View>
													</View>
													<View>
														<Text className='font-medium'>{module.module_name}</Text>
														<Text className='text-xs font-light'>{module.class.subject}</Text>
														{role === 'instructor' ? (
															<Text className="text-xs font-light">{module.class.class_section}</Text>
														) : (
															<Text className="text-xs font-light">Prof. {module.users.first_name} {module.users.last_name}</Text>
														)}
													</View>
												</View>
											</View>
											<View className="pt-4">
												<View className="border-t border-border"></View>
											</View>
											<Text className="pt-2 text-xs font-light text-foreground/50">{module.file_attachments.length} File{module.file_attachments.length > 1 ? "s" : ""}</Text>
										</View>
									</Pressable>
								))}
								<Pressable
									key={1} onPress={()=>{router.push({
									pathname: '/(module)/[moduleid]',
									params: { moduleid: "1" }
								})}}>
									<View className='bg-background border border-border p-4 rounded-lg'>
										<View className='flex flex-row justify-between'>
											<View className='flex flex-row items-start gap-4'>
												<View className='p-2.5 bg-orange-300 rounded-lg'>
													<View>
														<Icon as={FileText} className='size-5 text-orange-600' />
													</View>
												</View>
												<View>
													<Text className='font-medium'>Week 1 Module</Text>
													<Text className='text-xs font-light'>CE Comrpehension Course 1</Text>
													<Text className="text-xs font-light">Prof. Justin Nabunturan</Text>
												</View>
											</View>
										</View>
										<View className="pt-4">
											<View className="border-t border-border"></View>
										</View>
										<Text className="pt-2 text-xs font-light text-foreground/50">2 Files</Text>
									</View>
								</Pressable>
							</>
						)}
					</View>
				</View>
			</View>
    </>
  )
}

