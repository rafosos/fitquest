import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { StyleSheet, Platform, StatusBar } from "react-native";
import { SessionProvider } from "./ctx";
import { AutocompleteDropdownContextProvider } from 'react-native-autocomplete-dropdown';
import { colors } from '@/constants/Colors';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  initialRouteName: "login",
};

export default function RootLayout() {
  const [loaded] = useFonts({
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
        <Stack screenOptions={{contentStyle: styles.AndroidSafeArea}}>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="cadastro" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
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
