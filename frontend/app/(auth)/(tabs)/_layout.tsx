import { Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';

export default function TabLayout() {
  return (
    <Tabs
        screenOptions={{
            tabBarActiveTintColor: 'light',
            headerShown: false,
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
                tabBarIcon: ({ color, focused }) => (
                    <TabBarIcon name={focused ? 'walk' : 'walk-outline'} color={color} />
                ),
            }}
            />
        <Tabs.Screen
            name="ranking"
            options={{
                    unmountOnBlur: true,
                title: 'Ranking',
                tabBarIcon: ({ color, focused }) => (
                    <TabBarIcon name={focused ? 'trophy' : 'trophy-outline'} color={color} />
                ),
            }}
        />
        <Tabs.Screen
            name="index"
            options={{
                title: 'Avatar',
                tabBarIcon: ({ color, focused }) => (
                <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
                ),
            }}
            />
        <Tabs.Screen
            name="amigos"
            options={{
                title: 'Amigos',
                tabBarIcon: ({ color, focused }) => (
                    <TabBarIcon name={focused ? 'people' : 'people-outline'} color={color} />
                ),
            }}
        />
        <Tabs.Screen
            name="loja"
            options={{
                title: 'Loja',
                tabBarIcon: ({ color, focused }) => (
                    <TabBarIcon name={focused ? 'basket' : 'basket-outline'} color={color} />
                ),
            }}
         />
    </Tabs>
  );
}
