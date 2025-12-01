import { Text } from '@/components/ui/text';
import { THEME } from '@/lib/theme';
import { Calendar1, ChevronDown, ChevronUp, Ellipsis, FileText, Plus, X } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { useEffect, useState } from 'react';
import { Animated, Modal, Pressable, ScrollView, TextInput, TouchableOpacity, View } from "react-native";
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import { Icon } from './ui/icon';
import DateTimePicker from '@react-native-community/datetimepicker';
import { supabase } from '@/lib/supabase';

export default function CalendarComponent(){

	const today = new Date().toISOString().split("T")[0];
	const day = new Date().toISOString().split("T")[0];
	const [ready, setReady] = useState(false);

	const { colorScheme } = useColorScheme();
	
	const [showComponent, setShowComponent] = useState(true)
	const [loading, setLoading] = useState(false);

	const [selectedDate, setSelectedDate] = useState(today);
	const [selectedDateTimeStamp, setSelectedDateTimeStamp] = useState<any | null>()
	const [monthDate, setMonthDate] = useState(today)
	const [showModal, setShowModal] = useState(false);
	const [openDatePicker, setOpenDatePicker] = useState(false);

	const [taskTitle, setTaskTitle] = useState('');
	const [taskDescription, setTaskDescription] = useState('');
	const [pickedColor, setPickedColor] = useState(1);

	const [toggleTaskDropdown, setToggleTaskDropdown] = useState<number | null>();

	const [markedDates, setMarkedDates] = useState({});
	const [tasks, setTasks] = useState<any[]>([]);

	const colors = [
		"#51a2ff", //Blue
		"#fcc800", //Yellow
		"#ca3500", //Orange
		"#00c951", //Green
		"#8e51ff", //Violet
	]

	type Activity = {
		title: string;
		subject: string
	};

	const activitiesByDate: Record<string, Activity[]> = {
		"2025-11-26": [{title: "Chapter 5 Quiz", subject: "CE Comprehensive Course 1" }],
		"2025-12-05": [{title: "Chapter 6 Quiz", subject: "Calculus 1" }],
	};

	const tasksForSelectedDate = tasks.filter(task => {
		const taskDate = task.task_date.split("T")[0]; // YYYY-MM-DD
		return taskDate === selectedDate;
	});

	const lightTheme = {
    backgroundColor: THEME.light.background,
    calendarBackground: THEME.light.background,
    textSectionTitleColor: '#000',
    dayTextColor: '#000',
    todayTextColor: '#FF0000',
    selectedDayBackgroundColor: '#6200EE',
    selectedDayTextColor: '#FFFFFF',
    arrowColor: '#6200EE',
    monthTextColor: '#000',
    textDisabledColor: '#AAA',
    dotColor: '#6200EE',
    selectedDotColor: '#FFF',
  };

  const darkTheme = {
    backgroundColor: THEME.dark.background,
    calendarBackground: THEME.dark.background,
    textSectionTitleColor: '#FFF',
    dayTextColor: '#FFF',
    todayTextColor: '#FF4500',
    selectedDayBackgroundColor: '#BB86FC',
    selectedDayTextColor: '#000',
    arrowColor: '#BB86FC',
    monthTextColor: '#FFF',
    textDisabledColor: '#555',
    dotColor: '#BB86FC',
    selectedDotColor: '#000',
  };

	useEffect(() => {
		const marks: any = {};

		// ✅ Group tasks by date and attach multiple dots
		tasks.forEach(task => {
			const dateKey = task.task_date.split("T")[0]; // YYYY-MM-DD

			if (!marks[dateKey]) {
				marks[dateKey] = {
					dots: [],
				};
			}

			// ✅ Add one dot per task
			marks[dateKey].dots.push({
				key: task.id,
				color: task.task_color || "#22c55e",
			});
		});

		// ✅ Apply selected date styling (merge with existing dots)
		if (selectedDate) {
			marks[selectedDate] = {
				...(marks[selectedDate] || {}),
				selected: true,
				selectedColor: "#d38843ff",
				selectedTextColor: "white",
			};
		}

		setMarkedDates(marks);
	}, [tasks, selectedDate]);

	useEffect(() => {
		// ✅ Forces correct layout calculation on Android
		const timer = setTimeout(() => setReady(true), 120);
		return () => clearTimeout(timer);
	}, []);

	const [theme, setTheme] = useState(colorScheme);

  useEffect(() => {
    // When the system color scheme changes, update state
    setTheme(colorScheme);
  }, [colorScheme]);

	const handleFetchTasks = async () => {
		setLoading(true);

		try {
			const {
				data: { user },
				error: authError,
			} = await supabase.auth.getUser();

			if (!user || authError) {
				throw new Error("Not authenticated");
			}

			const { data, error } = await supabase
				.from("student_personalised_task")
				.select(`
					id,
					task_title,
					description,
					task_color,
					task_date,
					created_at
				`)
				.eq("student_id", user.id)   // ✅ ONLY this user's tasks
				.order("task_date", { ascending: true });

			if (error) throw error;

			console.log("Fetched tasks:", data);
			setTasks(data || []);
		} catch (err) {
			console.error("Fetch tasks failed:", err);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		handleFetchTasks();
	}, []);

	const handleAddTask = async () => {
		try {
			if (!taskTitle || !taskDescription ) {
				alert("Title and date are required");
				return;
			}

			const {
				data: { user },
				error: authError,
			} = await supabase.auth.getUser();

			if (!user || authError) {
				throw new Error("Not authenticated");
			}

			const { data, error } = await supabase
				.from("student_personalised_task")
				.insert({
					student_id: user.id,          // ✅ MUST be user.id
					task_title: taskTitle.trim(),
					description: taskDescription.trim(),
					task_color: colors[pickedColor],        // e.g. "#8b5cf6"
					task_date: selectedDateTimeStamp,
				})
				.select()
				.single();

			if (error) throw error;

			console.log("Task added:", data);
			alert("Task added successfully ✅");
			setTaskTitle('')
			setTaskDescription('')
			setPickedColor(0);
			setShowModal(false)
			await handleFetchTasks();

		} catch (err: any) {
			console.error("Add task failed:", err);
			alert(err.message || "Failed to add task");
		}
	};
	
	const handleTaskDropdown = (index: number) => {
		setToggleTaskDropdown(prev => (prev === index ? null : index));
	};

  return(
		<>
			<Pressable onPress={()=>setShowComponent(!showComponent)}>
				<View className='flex flex-row justify-between items-center mr-2 overflow-visible'>
					<Text className="font-semibold my-2">Activity Calendar</Text>
					{showComponent === true ? (
						<ChevronUp 
							color={colorScheme === 'dark' ? THEME.dark.foreground : THEME.light.foreground}
						/>
					): (
						<ChevronDown 
							color={colorScheme === 'dark' ? THEME.dark.foreground : THEME.light.foreground}
						/>
					)}
				</View>
			</Pressable>

			{showComponent && (
				<View className='flex flex-column items-center'>
					<View 
						style={{
							width: 320,
							overflow: "hidden",  // ✅ Prevents render glitches
						}}>
						<Calendar
							key={`${colorScheme}-${selectedDate}-${monthDate}`}
							style={{borderRadius: 20, height: 370}}
							theme={colorScheme === 'dark' ? darkTheme : lightTheme}
							// Initially visible month. Default = now
							initialDate={monthDate}
							// Handler which gets executed on day press. Default = undefined
							onDayPress={day => {
								console.log('selected day', day);
								setSelectedDate(day.dateString);
								setSelectedDateTimeStamp(new Date(day.timestamp).toISOString())
							}}
							
							// Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
							monthFormat={'yyyy MMMM'}
							// Handler which gets executed when visible month changes in calendar. Default = undefined
							onMonthChange={month => {
								console.log('month changed', month);
								setMonthDate(month.dateString)
							}}
							// Hide month navigation arrows. Default = false
							hideArrows={false}
							// Replace default arrows with custom ones (direction can be 'left' or 'right')
							// Do not show days of other months in month page. Default = false
							hideExtraDays={true}
							// If hideArrows = false and hideExtraDays = false do not switch month when tapping on greyed out
							// day from another month that is visible in calendar page. Default = false
							disableMonthChange={false}
							// If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday
							firstDay={1}
							// Hide day names. Default = false
							hideDayNames={false}
							// Show week numbers to the left. Default = false
							onPressArrowLeft={subtractMonth => subtractMonth()}
							// Handler which gets executed when press arrow icon right. It receive a callback can go next month
							onPressArrowRight={addMonth => addMonth()}
							// Disable left arrow. Default = false
							markingType="multi-dot"
							enableSwipeMonths={true}
							markedDates={markedDates}
						/>
					</View>
					<View className="-mt-2 w-full p-4 border border-border rounded-lg relative">
						<Text className="font-semibold mb-2">
							Activities on {selectedDate}
						</Text>

						{tasksForSelectedDate.length === 0 ? (
							<Text className="text-sm text-muted-foreground">
								No activities for this date
							</Text>
						) : (
							tasksForSelectedDate.map((task, index) => (
								<View
									key={index}
									className="border border-border rounded-lg p-3 mb-2 flex flex-row items-center justify-between gap-2 z-1"
									
								>
									<View className='flex flex-row gap-2'>
										<View className='p-2.5 bg-orange-300 rounded-lg self-start'>
											<View>
												<Icon as={FileText} className='size-5 text-orange-600' />
											</View>
										</View>
										<View>
											<Text className='font-bold'>{task.task_title}</Text>
											<Text className='text-xs font-light'>{task.description}</Text>
										</View>
									</View>
									{/* Dropdown Menu */}
									<Pressable onPress={()=>handleTaskDropdown(index)} className='relative' style={{elevation: 1, zIndex: 1}}>
										<Icon as={Ellipsis} className='size-5 text-foreground mr-2' />
										{toggleTaskDropdown === index && (
											<View className='w-20 border border-border bg-background rounded-lg absolute -top-4 right-8' style={{zIndex: 20}}>
												<Pressable>
													<Text className='p-2'>Edit</Text>
												</Pressable>
												<Pressable className='border-t border-border'>
													<Text className='p-2'>Delete</Text>
												</Pressable>
											</View>
										)}
									</Pressable>
								</View>
							))
						)}
						<Pressable onPress={()=>setShowModal(true)}>
							<View className='mt-2 flex flex-row items-center gap-2'>
								<View className='p-1.5 bg-foreground/20 rounded-full self-center'>
									<View>
										<Icon as={Plus} className='size-3 text-foreground' />
									</View>
								</View>
									<Text className='text-sm'>Add Personalised Task</Text>
							</View>
						</Pressable>
					</View>
				</View>
			)}
			<Modal
				transparent={true}
				visible={showModal}
				animationType='fade'
			>
				<View className='flex-1 flex-row justify-center items-center bg-black/40'>
					<View className="bg-gray-100 dark:bg-neutral-900 p-4 w-[90%] rounded-lg">
						<View className="flex flex-row justify-between">
							<Text className="text-lg font-semibold text-gray-900 dark:text-white">Add Personalised Task</Text>
							<Pressable 
								className='rounded-full bg-foreground/20 p-2 active:opacity-70 active:scale-95 self-center' 
								onPress={()=> setShowModal(false)}
							>
								<Icon as={X} className='size-4 text-background' />  
							</Pressable>
						</View>
						<View className='flex flex-row items-center gap-4 mb-4'>
							<Icon as={Calendar1} className='size-6 text-foreground'/>							
							<Text className='font-light text-foreground/50'>{selectedDate}</Text>							
						</View>
						<View className="flex flex-col items-start">
							<Text className="mb-2">Title</Text>
							<TextInput 
								className="w-full bg-foreground/10 p-4 rounded-lg text-foreground mb-2"
								placeholder="Add Title"
								placeholderTextColor={colorScheme === 'dark' ? '#6b7280' : '#9ca3af'}
								value={taskTitle}
								onChangeText={setTaskTitle}
							/>
							<Text className="mb-2">Description</Text>
							<TextInput 
								multiline
								textAlignVertical="top"
								className="w-full bg-foreground/10 p-4 rounded-lg text-foreground mb-2"
								placeholder="Add a short description"
								placeholderTextColor={colorScheme === 'dark' ? '#6b7280' : '#9ca3af'}
								value={taskDescription}
								onChangeText={setTaskDescription}
							/>
							<Text className="mb-2">Color</Text>
							<View className='flex flex-row gap-3 mb-2'>
								<Pressable onPress={()=>setPickedColor(0)} className={`p-0.5 ${pickedColor === 0 ? "border border-foreground" : ""} rounded-full`}>
									<View className='bg-blue-400 p-3 rounded-full'></View>
								</Pressable>
								<Pressable onPress={()=>setPickedColor(1)} className={`p-0.5 ${pickedColor === 1 ? "border border-foreground" : ""} rounded-full`}>
									<View className='bg-yellow-400 p-3 rounded-full'></View>
								</Pressable>
								<Pressable onPress={()=>setPickedColor(2)} className={`p-0.5 ${pickedColor === 2 ? "border border-foreground" : ""} rounded-full`}>
									<View className='bg-orange-700 p-3 rounded-full'></View>
								</Pressable>
								<Pressable onPress={()=>setPickedColor(3)} className={`p-0.5 ${pickedColor === 3 ? "border border-foreground" : ""} rounded-full`}>
									<View className='bg-green-500 p-3 rounded-full'></View>
								</Pressable>
								<Pressable onPress={()=>setPickedColor(4)} className={`p-0.5 ${pickedColor === 4 ? "border border-foreground" : ""} rounded-full`}>
									<View className='bg-violet-500 p-3 rounded-full'></View>
								</Pressable>
							</View>
							<Pressable 
								className="py-2 px-3 rounded-lg bg-foreground/10 active:opacity-75 self-end"
								onPress={handleAddTask}
							>
								<Text>Add</Text>
							</Pressable>
						</View>
					</View>
				</View>
			</Modal>
		</>
	)
}