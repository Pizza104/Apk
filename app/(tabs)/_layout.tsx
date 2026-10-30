import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/components/HapticTab";
import { TasksProvider } from "@/contexts/TasksContext";

export default function TabLayout() {
  return (
    <TasksProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarActiveTintColor: "#1F7753",
          tabBarInactiveTintColor: "#87938B",
          tabBarLabelStyle: { fontSize: 10, fontWeight: "700", marginBottom: 3 },
          tabBarStyle: {
            height: 66,
            paddingTop: 7,
            paddingBottom: 7,
            borderTopColor: "#E4EBE5",
            backgroundColor: "#FFFFFF",
            elevation: 0,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Tarefas",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons size={21} name={focused ? "checkbox" : "checkbox-outline"} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: "Resumo",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons size={21} name={focused ? "stats-chart" : "stats-chart-outline"} color={color} />
            ),
          }}
        />
      </Tabs>
    </TasksProvider>
  );
}
