
import { colors } from '@/constants/Colors';
import { FontAwesome6 } from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ComponentProps, useEffect } from 'react';
import { StyleProp, StyleSheet, Text, View } from 'react-native';
import Animated, { useSharedValue, withSpring } from 'react-native-reanimated';

interface PropsTabICon{
  focused: boolean,
  name: string
}

const icons = {
  "competicoes": (focused: boolean) => <Ionicons style={[styles.icon, focused? styles.iconFocused : styles.iconNotFocused]} name="podium" />,
  "amigos": (focused: boolean) => <Ionicons style={[styles.icon, focused? styles.iconFocused : styles.iconNotFocused]} name="people" />,
  "index": (focused: boolean) => <Ionicons style={[styles.icon, focused? styles.iconFocused : styles.iconNotFocused]} name="home" />,
  "exercicios": (focused: boolean) => <FontAwesome6 style={[styles.icon, focused? styles.iconFocused : styles.iconNotFocused]} name="dumbbell" />,
  "loja": (focused: boolean) => <Ionicons style={[styles.icon, focused? styles.iconFocused : styles.iconNotFocused]} name="basket" />
}
export function TabBarIcon({ name, focused }: PropsTabICon) {
  const marginBottom = useSharedValue(0);
  
  useEffect(() => {
    if(focused)
      marginBottom.value = withSpring(marginBottom.value + 1)
    else if (!focused && marginBottom.value > 0 )
      marginBottom.value = withSpring(marginBottom.value - 1)
  }, [focused])

  return (
    <View style={[focused ? styles.focused : styles.notFocused]}>
        {icons[name](focused)}
    </View>
    // <View style={{ marginBottom: 18}}>
    //   {/* <Animated.Text style={{ marginBottom }}><Ionicons name={name} size={28} /></Animated.Text> */}
    //   {/* <Text style={{ paddingBottom: 18 }}> */}
    //     <Ionicons style={{alignSelf: 'center'}} name={name} size={28} />
    //   {/* </Text> */}
    // </View>
  )
}

const styles = StyleSheet.create({
  focused:{
    backgroundColor: colors.cinza.medio2,
    flex:1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    borderRadius: 25
  },
  notFocused:{
    backgroundColor: colors.branco.padrao
  },
  icon:{
    alignSelf: 'center',
    fontSize: 28
  },
  iconFocused:{
    color: colors.verde.padrao
  }, 
  iconNotFocused:{
    color: colors.preto.padrao
  }
})

