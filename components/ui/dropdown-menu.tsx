"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  Modal,
  Animated,
  Easing,
} from "react-native";
import { Icon } from "lucide-react-native";
import { cn } from "@/lib/utils"; // for merging classNames

interface DropdownMenuProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  trigger,
  children,
}) => {
  const [visible, setVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 120,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 120,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  return (
    <View>
      {/* Trigger */}
      <Pressable onPress={() => setVisible(!visible)}>
        {trigger}
      </Pressable>

      {/* Menu Overlay */}
      
        {visible && (
          <Pressable
            className={`flex-1 bg-black/1 00 absolute top-7 -right-2 z-50 `}
            onPress={() => {setVisible(false);console.log("press")}}
          >
            <Animated.View
              style={{
                opacity: fadeAnim,
                transform: [
                  {
                    scale: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.95, 1],
                    }),
                  },
                ],
              }}
              className="bg-popover border border-border rounded-xl p-2 shadow-lg w-44"
            >
              {React.Children.map(children, (child) =>
                React.cloneElement(child as any, {
                  closeMenu: () => setVisible(false),
                })
              )}
            </Animated.View>
          </Pressable>
        )}
      
    </View>
  );
};

interface DropdownMenuItemProps {
  onPress?: () => void;
  icon?: React.ElementType;
  label?: string;
  variant?: "default" | "destructive";
  closeMenu?: () => void;
}

export const DropdownMenuItem: React.FC<DropdownMenuItemProps> = ({
  onPress,
  icon: IconComp,
  label,
  variant = "default",
  closeMenu,
}) => {
  const handlePress = () => {
    onPress?.();
    closeMenu?.();
  };

  return (
    <Pressable
      onPress={handlePress}
      className={cn(
        "flex-row items-center gap-2 px-3 py-2 rounded-lg active:bg-foreground/10",
        variant === "destructive" && "active:bg-red-100"
      )}
    >
      {IconComp && (
        <IconComp
          size={18}
          color={variant === "destructive" ? "red" : "gray"}
        />
      )}
      <Text
        className={cn(
          "text-sm text-foreground",
          variant === "destructive" && "text-red-500"
        )}
      >
        {label}
      </Text>
    </Pressable>
  );
};

export const DropdownMenuSeparator = () => (
  <View className="h-[1px] bg-border my-1" />
);