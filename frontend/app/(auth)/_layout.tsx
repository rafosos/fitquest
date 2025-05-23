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

  if (!session) {
    return <Redirect href="/bemvindo" />;
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false, contentStyle: {"backgroundColor": colors.cinza.background} }} />
      <Stack.Screen name="configuracoes" options={{ headerShown: false, presentation: 'modal', contentStyle: {"backgroundColor": colors.cinza.background} }} />
      <Stack.Screen name="perfil" options={{ headerShown: false, presentation: 'modal', contentStyle: {"backgroundColor": colors.cinza.background} }} />
      <Stack.Screen name="lixeira" options={{ headerShown: false, presentation: 'modal', contentStyle: {"backgroundColor": colors.cinza.background} }} />
    </Stack>
  )
}