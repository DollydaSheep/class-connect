import { Pressable, StyleSheet, View, Image } from 'react-native'
import { Text } from '@/components/ui/text';
import React, { useEffect, useState } from 'react'
import { router, Stack, useLocalSearchParams } from 'expo-router'
import { THEME } from '@/lib/theme';
import { collection, query, where, getDocs, getDoc, doc, Timestamp } from "firebase/firestore";
import { db } from '@/lib/firebase';
import { Bell, ChevronRight, Ellipsis, FileText, Plus, Zap } from 'lucide-react-native';
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

	const [toggleTaskDropdown, setToggleTaskDropdown] = useState<number | null>();

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
			setAnnouncements(data || []);

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

	const handleDeleteAnnouncement = async (announcementid: string) => {
		setAnnouncements([]);
		setLoading(true);
		try {
			const {
				data: { user },
				error: authError,
			} = await supabase.auth.getUser();

			if (!user || authError) throw new Error("Not authenticated");

			const { error } = await supabase
				.from("class_announcement")
				.delete()
				.eq("id", announcementid)
				.eq("instructor_id", user.id); // ✅ Security check

			if (error) throw error;

			setLoading(false);
			setToggleTaskDropdown(null)

			alert("Announcement deleted ✅");

			await handleFetchAnnouncements();

		} catch (err: any) {
			console.error("Delete announcement failed:", err);
			alert(err.message || "Failed to delete announcement");
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

	const handleDeleteModule = async (moduleid: string) => {
		setModules([]);
		setLoading(true);
		try {
			const {
				data: { user },
				error: authError,
			} = await supabase.auth.getUser();

			if (!user || authError) throw new Error("Not authenticated");

			const { error } = await supabase
				.from("class_module")
				.delete()
				.eq("id", moduleid)
				.eq("instructor_id", user.id); // ✅ Security check

			if (error) throw error;

			setLoading(false);
			setToggleTaskDropdown(null)

			alert("Module deleted ✅");

			await handleFetchModules();

		} catch (err: any) {
			console.error("Delete module failed:", err);
			alert(err.message || "Failed to delete module");
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

	const handleDeleteActivity = async (activityid: string) => {
		setActivities([]);
		setLoading(true);
		try {
			const {
				data: { user },
				error: authError,
			} = await supabase.auth.getUser();

			if (!user || authError) throw new Error("Not authenticated");

			const { error } = await supabase
				.from("class_activity")
				.delete()
				.eq("id", activityid)
				.eq("instructor_id", user.id); // ✅ Security check

			if (error) throw error;

			setLoading(false);
			setToggleTaskDropdown(null)

			alert("Activity deleted ✅");

			await handleFetchActivities();

		} catch (err: any) {
			console.error("Delete activity failed:", err);
			alert(err.message || "Failed to delete activity");
		}
	};

	useEffect(() => {
		setActivities([]);
		setModules([]);
		setAnnouncements([]);
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

	const timeAgo = (timestamp: string | number | Date) => {
		const now = new Date().getTime();
		const created = new Date(timestamp).getTime();
		const diffMs = now - created;

		const minutes = Math.floor(diffMs / (1000 * 60));
		const hours = Math.floor(diffMs / (1000 * 60 * 60));
		const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

		if (minutes < 1) return "Just now";
		if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
		if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
		return `${days} day${days > 1 ? "s" : ""} ago`;
	};

	const handleTaskDropdown = (index: number) => {
		setToggleTaskDropdown(prev => (prev === index ? null : index));
	};

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
						<Pressable onPress={()=>{setSelected(1); setToggleTaskDropdown(null)}} className='grow'>
							<View className={`px-2 py-3 ${selected === 1 ? "rounded-t-md" : "bg-foreground/5"}`}>
								<Text className={`text-center text-xs`}>Activities</Text>
							</View>
						</Pressable>
						<Pressable onPress={()=>{setSelected(2); setToggleTaskDropdown(null)}} className='grow'>
							<View className={`px-2 py-3 ${selected === 2 ? "rounded-t-md" : "bg-foreground/5"}`}>
								<Text className={`text-center text-xs`}>Module</Text>
							</View>
						</Pressable>
						<Pressable onPress={()=>{setSelected(3); setToggleTaskDropdown(null)}} className='grow'>
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
												{role === 'instructor' && (
													<>
														<Pressable className='active:opacity-75' onPress={()=>{handleTaskDropdown(index)}}>
															<Icon as={Ellipsis} className='size-5'/>
														</Pressable>
														{toggleTaskDropdown === index && (
															<View className='w-20 border border-border bg-background rounded-lg absolute -top-6 right-8' style={{zIndex: 20}}>
																<Pressable onPress={()=>{
																	router.push({
																	pathname: '/(activity)/editActivity',
																	params: { activityid: act.id, classid: classid }
																})
																	setToggleTaskDropdown(null);
																}}>
																	<Text className='p-2'>Edit</Text>
																</Pressable>
																<Pressable onPress={()=>handleDeleteActivity(act.id)} className='border-t border-border'>
																	<Text className='p-2'>Delete</Text>
																</Pressable>
															</View>
														)}
													</>
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
												<Pressable className='active:opacity-75' onPress={()=>{handleTaskDropdown(index)}}>
													<Icon as={Ellipsis} className='size-5'/>
												</Pressable>
												{toggleTaskDropdown === index && (
													<View className='w-20 border border-border bg-background rounded-lg absolute -top-6 right-8' style={{zIndex: 20}}>
														<Pressable onPress={()=>{
															router.push({
															pathname: '/(module)/editModule',
															params: { moduleid: module.id, classid: classid }
														})
															setToggleTaskDropdown(null);
														}}>
															<Text className='p-2'>Edit</Text>
														</Pressable>
														<Pressable onPress={()=>handleDeleteModule(module.id)} className='border-t border-border'>
															<Text className='p-2'>Delete</Text>
														</Pressable>
													</View>
												)}
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
						{selected === 3 && (
							<>
								{loading && (
									<View className='gap-2 p-2'>
										<Skeletonbox height={80} />
										<Skeletonbox height={80} />
										<Skeletonbox height={80} />
									</View>
								)}
								{announcements.length === 0 && !loading && showEmpty && (
									<View className='p-2'>
										<Text className='text-sm font-light'>No announcements for this class.</Text>
									</View>
								)}
								{announcements.map((announcement, index)=>(
									<Pressable key={index} onPress={()=>{router.push({
										pathname: '/(announcement)/[announcementid]',
										params: { announcementid: announcement.id }
									})}}
									>
										<View className='bg-background border border-border p-4 rounded-lg'>
											<View className='flex flex-row justify-between'>
												<View className='flex flex-row items-start gap-4'>
													<View className='p-3 bg-blue-300 rounded-lg'>
														<View>
															<Icon as={Bell} className='size-4 text-blue-600' />
														</View>
													</View>
													<View>
														<Text numberOfLines={1} className='font-medium w-[190px] text-nowrap truncate'>{announcement.announcement_title}</Text>
														<Text className="text-xs font-light">{announcement.class.subject}</Text>
														<Text className='text-xs font-light'>Prof. {announcement.users.first_name} {announcement.users.last_name}</Text>
														<Text className='text-xs font-light mt-2 dark:text-gray-400 text-gray-600'>{timeAgo(announcement.created_at)}</Text>
													</View>
													<View className="self-stretch justify-between ml-4">
														<Pressable className='active:opacity-75' onPress={()=>{handleTaskDropdown(index)}}>
															<Icon as={Ellipsis} className='size-6'/>
														</Pressable>
														{toggleTaskDropdown === index && (
															<View className='w-20 border border-border bg-background rounded-lg absolute -top-6 right-8' style={{zIndex: 20}}>
																<Pressable onPress={()=>{
																	router.push({
																	pathname: '/(announcement)/editAnnouncement',
																	params: { announcementid: announcement.id, classid: classid }
																})
																	setToggleTaskDropdown(null);
																}}>
																	<Text className='p-2'>Edit</Text>
																</Pressable>
																<Pressable onPress={()=>handleDeleteAnnouncement(announcement.id)} className='border-t border-border'>
																	<Text className='p-2'>Delete</Text>
																</Pressable>
															</View>
														)}
														<Icon as={ChevronRight} className='size-6 text-foreground self-end'/>
													</View>
												</View>
											</View>
										</View>
									</Pressable>
								))}
							</>
						)}
					</View>
				</View>
			</View>
    </>
  )
}

