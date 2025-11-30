"use client";

import React, { useEffect } from "react";
import { Modal as RNModal, View, Text, TouchableOpacity, ScrollView, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    // Optional: handle any side effects when modal is opened/closed
  }, [isOpen]);

  return (
    <RNModal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <StatusBar barStyle="light-content" backgroundColor="rgba(0,0,0,0.7)" />

      {/* Backdrop */}
      <View className="flex-1 bg-black/70 items-center justify-center">
        {/* Modal Container */}
        <View className="bg-gray-100 dark:bg-neutral-900 rounded-2xl w-[90%] h-[65%] overflow-hidden shadow-2xl ">

          {/* Header */}
          <View className="flex-row items-center justify-between p-4">
            <Text className="text-2xl font-semibold text-gray-900 dark:text-white">{title}</Text>
            <TouchableOpacity
              onPress={onClose}
              className="p-1 rounded-full bg-gray-200/40 dark:bg-gray-700/40"
            >
              <Ionicons name="close" size={24} color="#888" />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView className="flex-1 p-4">
            {children}
          </ScrollView>
        </View>
      </View>
    </RNModal>
  );
};
