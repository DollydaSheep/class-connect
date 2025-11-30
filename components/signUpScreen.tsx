"use client"

import { Alert, Pressable, ScrollView, TextInput, View } from "react-native";
import { Checkbox } from '@futurejj/react-native-checkbox';
import {Picker} from '@react-native-picker/picker';
import { Text } from '@/components/ui/text';
import { useColorScheme } from "nativewind";
import { SafeAreaView } from "react-native-safe-area-context";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { useState } from "react";
import { THEME } from "@/lib/theme";
import { doc, setDoc } from "firebase/firestore";
import { supabase } from "@/lib/supabase";


export default function SignUpScreen({ onSwitch }: { onSwitch: () => void}) {
  const { colorScheme } = useColorScheme();

  const[firstName, setFirstName] = useState("");
  const[lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const [selectedRole, setSelectedRole] = useState("student");
  const [checked, setChecked] = useState(false);

  const toggleCheckbox = () => {
    setChecked(!checked);
  };

  const handleSignUp = async () => {
    if (!email || !password || !firstName || !lastName) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (password !== confirm) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (!checked) {
      Alert.alert("Error", "Please agree to the Terms of Service");
      return;
    }

    try {
      setLoading(true);

      // ✅ 1. Create account in Supabase Auth
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) throw signUpError;

      const user = data.user;

      if (!user) {
        throw new Error("User creation failed");
      }

      // ✅ 2. Save profile to Supabase Database (public.users table)
      const { error: insertError } = await supabase
        .from("users")
        .insert([
          {
            id: user.id, // same as auth.uid
            first_name: firstName,
            last_name: lastName,
            email,
            role: selectedRole,
            created_at: new Date(),
          },
        ]);

      if (insertError) throw insertError;

      Alert.alert("Success", "Account created successfully!");
      
    } catch (err: any) {
      console.error("Sign Up Error:", err.message);
      Alert.alert("Sign Up Failed", err.message || "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  return(
    <>
      <SafeAreaView className="flex-1 flex-col items-center justify-center">
        <ScrollView>
          <View className="flex flex-col w-72 gap-1">
            <Text className="text-xl font-semibold">Create account</Text>
            <Text className="text-xs dark:text-gray-400 text-gray-600 mb-4">Join ClassConnect to manage your classes</Text>
            <View className="flex flex-col gap-1 mb-1">
              <Text className="text-sm font-medium">First Name</Text>
              <TextInput 
                className="w-full bg-foreground/5 rounded-lg focus:border focus:border-foreground/50 px-3 py-4 text-foreground"
                placeholder="student@email"
                placeholderTextColor={colorScheme === 'dark' ? '#6b7280' : '#9ca3af'}
                value={firstName}
                onChangeText={setFirstName}
              />
            </View>
            <View className="flex flex-col gap-1 mb-1">
              <Text className="text-sm font-medium">Last Name</Text>
              <TextInput 
                className="w-full bg-foreground/5 rounded-lg focus:border focus:border-foreground/50 px-3 py-4 text-foreground"
                placeholder="student@email"
                placeholderTextColor={colorScheme === 'dark' ? '#6b7280' : '#9ca3af'}
                value={lastName}
                onChangeText={setLastName}
              />
            </View>
            <View className="flex flex-col gap-1 mb-1">
              <Text className="text-sm font-medium">Email</Text>
              <TextInput 
                className="w-full bg-foreground/5 rounded-lg focus:border focus:border-foreground/50 px-3 py-4 text-foreground"
                placeholder="student@email"
                placeholderTextColor={colorScheme === 'dark' ? '#6b7280' : '#9ca3af'}
                value={email}
                onChangeText={setEmail}
              />
            </View>
            <View className="flex flex-col gap-1 mb-2">
              <Text className="text-sm font-medium">Password</Text>
              <TextInput 
                className="w-full bg-foreground/5 rounded-lg focus:border focus:border-foreground/50 px-3 py-4 text-foreground"
                placeholder="Enter your password"
                placeholderTextColor={colorScheme === 'dark' ? '#6b7280' : '#9ca3af'}
                value={password}
                onChangeText={setPassword}
              />
            </View>
            <View className="flex flex-col gap-1 mb-2">
              <Text className="text-sm font-medium">Confirm Password</Text>
              <TextInput 
                className="w-full bg-foreground/5 rounded-lg focus:border focus:border-foreground/50 px-3 py-4 text-foreground"
                placeholder="Enter your password"
                placeholderTextColor={colorScheme === 'dark' ? '#6b7280' : '#9ca3af'}
                value={confirm}
                onChangeText={setConfirm}
              />
            </View>
            <View className="flex flex-col gap-1 mb-2">
              <Text className="text-sm font-medium">Select Role</Text>
              <View className="bg-foreground/5 rounded-lg">
                <Picker
                  style={{
                    color: colorScheme === "dark" ? THEME.dark.foreground : THEME.light.foreground,
                    marginLeft: 8,
                  }}
                  dropdownIconColor={colorScheme === "dark" ? THEME.dark.foreground : THEME.light.foreground}
                  selectedValue={selectedRole}
                  onValueChange={(itemValue, itemIndex)=>
                    setSelectedRole(itemValue)
                  }
                >
                  <Picker.Item label="Student" value="student" />
                  <Picker.Item label="Instructor" value="instructor" />
                </Picker>
              </View>
            </View>
            <Pressable onPress={toggleCheckbox}>
              <View className="flex flex-row items-center justify-center gap-1 mb-2">
                <Checkbox
                  status={checked ? "checked" : "unchecked"}
                  onPress={toggleCheckbox}
                  color="#7c3aed" // violet accent (optional)
                />
                <Text className="text-xs text-gray-600 dark:text-gray-400 flex-shrink">
                  I agree to the{" "}
                  <Text className="text-violet-600 font-semibold text-xs">Terms of Service</Text>{" "}
                  and{" "}
                  <Text className="text-violet-600 font-semibold text-xs">Privacy Policy</Text>
                </Text>
              </View>
            </Pressable>
            
            <Pressable className="mb-2" onPress={handleSignUp}>
              <View className="bg-violet-600 items-center p-3 rounded-lg">
                <Text className="font-semibold">Create Account</Text>
              </View>
            </Pressable>
            <Text className="text-sm text-center mb-4">Already have an account?
              <Text onPress={onSwitch} className="text-sm font-semibold underline"> Sign In</Text>
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  )
}