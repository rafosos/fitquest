import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { StyleSheet, Platform, StatusBar } from "react-native";
import { SessionProvider } from "./ctx";
import { AutocompleteDropdownContextProvider } from 'react-native-autocomplete-dropdown';
import { colors } from '@/constants/Colors';
import {
  Inter_100Thin,
  Inter_200ExtraLight,
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
  Inter_900Black,
} from '@expo-google-fonts/inter';
import { ToastProvider } from 'react-native-toast-notifications'

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  initialRouteName: "(auth)",
};

export default function RootLayout() {
  const [loaded] = useFonts({
    Inter_100Thin,
    Inter_200ExtraLight,
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    Inter_900Black,
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AutocompleteDropdownContextProvider>
      <SessionProvider>
        <ToastProvider>
          <Stack screenOptions={{contentStyle: styles.AndroidSafeArea, headerShown: false}}>
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="bemvindo" />
            <Stack.Screen name="login" />
            <Stack.Screen name="cadastro" />
            <Stack.Screen name="+not-found" />
          </Stack>
        </ToastProvider>
      </SessionProvider>
    </AutocompleteDropdownContextProvider>
  );
}

const styles = StyleSheet.create({
  AndroidSafeArea: {
    flex: 1,
    backgroundColor: colors.cinza.background,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
  }
});
