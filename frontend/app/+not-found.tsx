import StyledText from '@/components/base/styledText';
import { colors } from '@/constants/Colors';
import { Link, router, Stack, useNavigation, usePathname } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function NotFoundScreen() {

  const nav = useNavigation();
  const routeparam = usePathname();
  useEffect(() => {
    console.log(routeparam)
    const state = nav.getState()
    console.log(state.history);
    console.log(state.routes);
    
    
  }, []);

  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={styles.container}>
        <StyledText style={styles.txt}>This screen doesn't exist.</StyledText>
        <Link href="/" style={styles.link}>
          <StyledText style={styles.txt}>Go to home screen!</StyledText>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  txt:{
    color:colors.branco.padrao
  }
});
