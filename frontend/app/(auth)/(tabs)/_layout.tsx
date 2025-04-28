import { Tabs } from 'expo-router';
import React from 'react';
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
        initialRouteName='home'
    >
        <Tabs.Screen
            name="campeonato"
            options={{
                unmountOnBlur: true,
                title: 'Competições',
                tabBarIcon: ({ focused }) => (
                    <TabBarIcon focused={focused} name='competicoes' />
                ),
            }}
        />
        <Tabs.Screen
            name="amigos"
            options={{
                title: 'Amigos',
                tabBarIcon: ({ focused }) => (
                    <TabBarIcon focused={focused} name='amigos' />
                ),
            }}
        />
        <Tabs.Screen
            name="home"
            options={{
                title: 'Avatar',
                tabBarIcon: ({ focused }) => (
                    <TabBarIcon focused={focused} name='index' />
                ),
            }}
        />
        <Tabs.Screen
            name="rotina"
            options={{
                title: 'Treino',
                tabBarIcon: ({ focused }) => (
                    <TabBarIcon focused={focused} name='exercicios' />
                ),
            }}
         />
        <Tabs.Screen
            name="loja"
            options={{
                title: 'Loja',
                tabBarIcon: ({ focused }) => (
                    <TabBarIcon focused={focused} name='loja' />
                ),
            }}
         />
        <Tabs.Screen
            name="index"            
            options={{
                href: null,
            }}
         />
    </Tabs>
  );
}
