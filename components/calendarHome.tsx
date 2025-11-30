import { Text } from '@/components/ui/text';
import { THEME } from '@/lib/theme';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { useEffect, useState } from 'react';
import { Animated, Pressable, ScrollView, TextInput, TouchableOpacity, View } from "react-native";
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';

export default function CalendarComponent(){

	const today = new Date().toISOString().split("T")[0];
	const day = new Date().toISOString().split("T")[0];
	const [ready, setReady] = useState(false);

	const { colorScheme } = useColorScheme();
	
	const [showComponent, setShowComponent] = useState(true)

	useEffect(() => {
		// ✅ Forces correct layout calculation on Android
		const timer = setTimeout(() => setReady(true), 120);
		return () => clearTimeout(timer);
	}, []);

  return(
		<>
			<Pressable onPress={()=>setShowComponent(!showComponent)}>
				<View className='flex flex-row justify-between items-center mr-2'>
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
				<View className='flex flex-row justify-center'>
					<View 
						style={{
							width: 320,
							overflow: "hidden",  // ✅ Prevents render glitches
						}}>
						<Calendar
							style={{borderRadius: 20, height: 370}}
							theme={{
								backgroundColor: '#ffffff',
								calendarBackground: '#ffffff',
								textSectionTitleColor: '#b6c1cd',
								textSectionTitleDisabledColor: '#d9e1e8',
								selectedDayBackgroundColor: '#00adf5',
								selectedDayTextColor: '#ffffff',
								todayTextColor: '#00adf5',
								dayTextColor: '#2d4150',
								textDisabledColor: '#2d4150',
								dotColor: '#00adf5',
								selectedDotColor: '#ffffff',
								arrowColor: 'orange',
								disabledArrowColor: '#d9e1e8',
								monthTextColor: 'blue',
								indicatorColor: 'blue',
								textDayFontFamily: 'monospace',
								textMonthFontFamily: 'monospace',
								textDayHeaderFontFamily: 'monospace',
								textDayFontWeight: '300',
								textMonthFontWeight: 'bold',
								textDayHeaderFontWeight: '300',
								textDayFontSize: 16,
								textMonthFontSize: 16,
								textDayHeaderFontSize: 16
							}}
							// Initially visible month. Default = now
							initialDate={today}
							// Handler which gets executed on day press. Default = undefined
							onDayPress={day => {
								console.log('selected day', day);
							}}
							// Handler which gets executed on day long press. Default = undefined
							onDayLongPress={day => {
								console.log('selected day', day);
							}}
							// Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
							monthFormat={'yyyy MMMM'}
							// Handler which gets executed when visible month changes in calendar. Default = undefined
							onMonthChange={month => {
								console.log('month changed', month);
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
							markedDates={{
								[today]: {
									selected: true,
									selectedColor: "#4CAF50",
									selectedTextColor: "white",
								},
							}}
						/>
					</View>
				</View>
			)}
		</>
	)
}