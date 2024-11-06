import { Redirect, Stack } from 'expo-router';
import { useSession } from '../ctx';
import { Text } from 'react-native';
import { colors } from '@/constants/Colors';

export default function AppLayout() {
  const { session, isLoading } = useSession();
  // You can keep the splash screen open, or render a loading screen like we do here.
  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  // Only require authentication within the (app) group's layout as users
  // need to be able to access the (auth) group and sign in again.
  if (!session) {
    return <Redirect href="/login" />;
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false, contentStyle: {"backgroundColor": colors.cinza.background} }} />
      <Stack.Screen name="configuracoes" options={{ headerShown: false, presentation: 'modal', contentStyle: {"backgroundColor": colors.cinza.background} }} />
    </Stack>
  )
}