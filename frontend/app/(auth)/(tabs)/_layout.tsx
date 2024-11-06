import { Tabs } from 'expo-router';
import React from 'react';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';

export default function TabLayout() {
  return (
    <Tabs
        screenOptions={{
            tabBarShowLabel: false,
            tabBarActiveTintColor: 'light',
            headerShown: false,
            tabBarStyle: {overflow: 'visible'},
            tabBarItemStyle:{
                marginVertical: 5
            }  
        }}
        initialRouteName='index'
    >
        <Tabs.Screen
            name="competicoes"
            options={{
                unmountOnBlur: true,
                title: 'Competições',
                tabBarIcon: ({ focused }) => (
                    <TabBarIcon focused={focused} name='podium' />
                ),
            }}
        />
        <Tabs.Screen
            name="amigos"
            options={{
                title: 'Amigos',
                tabBarIcon: ({ focused }) => (
                    <TabBarIcon focused={focused} name='people' />
                ),
            }}
        />
        <Tabs.Screen
            name="index"
            options={{
                title: 'Avatar',
                tabBarIcon: ({ focused }) => (
                    <TabBarIcon focused={focused} name='home' />
                ),
            }}
            />
        <Tabs.Screen
            name="exercicios"
            options={{
                title: 'Treino',
                tabBarIcon: ({ color, focused }) => (
                    <FontAwesome6 name="dumbbell" size={24} color={color} />
                ),
            }}
         />
        <Tabs.Screen
            name="loja"
            options={{
                title: 'Loja',
                tabBarIcon: ({ focused }) => (
                    <TabBarIcon focused={focused} name='basket' />
                ),
            }}
         />
    </Tabs>
  );
}
