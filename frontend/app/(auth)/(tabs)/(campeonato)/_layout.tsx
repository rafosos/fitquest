import { Stack } from 'expo-router';

export default function CampeonatoLayout() {
 
  return (
    <Stack screenOptions={{headerShown: false}}>
      <Stack.Screen name="index" />
      <Stack.Screen name="detalhes" options={{presentation: "modal"}}/>
    </Stack>
  );
}
