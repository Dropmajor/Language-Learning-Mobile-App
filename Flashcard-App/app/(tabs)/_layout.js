import { Tabs } from 'expo-router';
import React from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useState, useEffect } from 'react';
import * as SystemUI from "expo-system-ui";

export default function RootLayout() {
  async function onload() {
    await SystemUI.setBackgroundColorAsync('black');
  }
  useEffect(() => {
    onload()
  }, [])
  
  return (
    <Tabs screenOptions={{headerShown: false, tabBarActiveTintColor: 'black'}} backBehavior="history">
      <Tabs.Screen name="TranslationHomeScreen"
        options={{
          unmountOnBlur: true,
          title: 'Translate',
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons name="translate" size={28} style={[{ marginBottom: -3 }, color={color}]}/>
          ),
        }}
      />
      <Tabs.Screen name="EditFlashcardScreen"
        options={{
          unmountOnBlur: true,
          href: null,
          tabBarStyle: { display: 'none'}
        }}
      />
      <Tabs.Screen name="FlashcardManagementScreen"
        options={{
          unmountOnBlur: true,
          title: 'Flashcards',
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons name={focused ? 'cards' : 'cards-outline'} size={28} style={[{ marginBottom: -3 }, color={color}]}/>
          ),
        }}
      />
      <Tabs.Screen name="QuizInitialisationScreen"
        options={{
          unmountOnBlur: true,
          title: 'Quiz',
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons name="quiz" size={28} style={[{ marginBottom: -3 }, color={color}]}/>
          ),
        }}
      />
      <Tabs.Screen name="QuizScreen"
        options={{
          unmountOnBlur: true,
          href: null,
          tabBarStyle: { display: 'none'}
        }}
      />
      <Tabs.Screen name="index"
        options={{
          unmountOnBlur: true,
          href: null,
        }}
      />
      <Tabs.Screen name="intentFilterScreen"
        options={{
          unmountOnBlur: true,
          href: null,
          tabBarStyle: { display: 'none'},
          presentation: 'modal',
        }}
      />
    </Tabs>
  );
}