import { Stack } from 'expo-router';

export default function RotinaLayout() {
  return (
    <Stack screenOptions={{headerShown: false}}>
      <Stack.Screen name="index" />
    </Stack>
  );
}