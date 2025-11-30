import { Text } from '@/components/ui/text';
import { THEME } from '@/lib/theme';
import { ChevronDown, ChevronUp, FileText } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { useEffect, useState } from 'react';
import { Animated, Pressable, ScrollView, TextInput, TouchableOpacity, View } from "react-native";
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import { Icon } from './ui/icon';

export default function CalendarComponent(){

	const today = new Date().toISOString().split("T")[0];
	const day = new Date().toISOString().split("T")[0];
	const [ready, setReady] = useState(false);

	const { colorScheme } = useColorScheme();
	
	const [showComponent, setShowComponent] = useState(true)

	const [selectedDate, setSelectedDate] = useState(today);
	const [monthDate, setMonthDate] = useState(today)

	type Activity = {
		title: string;
		subject: string
	};

	const activitiesByDate: Record<string, Activity[]> = {
		"2025-11-26": [{title: "Chapter 5 Quiz", subject: "CE Comprehensive Course 1" }],
		"2025-12-05": [{title: "Chapter 6 Quiz", subject: "Calculus 1" }],
	};

	const markedDates: Record<string, any> = {};

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

	Object.keys(activitiesByDate).forEach(date => {
		markedDates[date] = {
			marked: true, // shows a dot
			dotColor: '#d38843ff', // optional custom dot color
		};
	});

	markedDates[selectedDate] = {
		...(markedDates[selectedDate] || {}),
		selected: true,
		selectedColor: '#d38843ff',
		selectedTextColor: 'white',
		dotColor: 'white'
	};

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
							
							enableSwipeMonths={true}
							markedDates={markedDates}
						/>
					</View>
					<View className="-mt-2 w-full p-4 border border-border rounded-lg">
						<Text className="font-semibold mb-2">
							Activities on {selectedDate}
						</Text>

						{(activitiesByDate[selectedDate]?.length ?? 0) === 0 ? (
							<Text className="text-sm text-muted-foreground">
								No activities for this date
							</Text>
						) : (
							activitiesByDate[selectedDate].map((item, index) => (
								<View
									key={index}
									className="border border-border rounded-lg p-3 mb-2 flex flex-row items-center gap-2"
								>
									<View className='p-2.5 bg-orange-300 rounded-lg self-start'>
										<View>
											<Icon as={FileText} className='size-5 text-orange-600' />
										</View>
									</View>
									<View>
										<Text className='font-bold'>{item.title}</Text>
										<Text className='text-xs font-light'>{item.subject}</Text>
									</View>
								</View>
							))
						)}
					</View>
				</View>
			)}
		</>
	)
}