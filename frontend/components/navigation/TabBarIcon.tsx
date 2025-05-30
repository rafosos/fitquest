import Amigos from '@/assets/images/amigos';
import Dumbbell from '@/assets/images/dumbbell';
import HomeSvg from '@/assets/images/home';
import Loja from '@/assets/images/loja';
import Trofeu from '@/assets/images/trofeu';
import { colors } from '@/constants/Colors';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSharedValue, withSpring } from 'react-native-reanimated';

interface PropsTabICon{
  focused: boolean,
  name: "competicoes" | "amigos" | "index" | "exercicios" | "loja"
}

const icons = {
  "competicoes": Trofeu,
  "amigos": Amigos,
  "index": HomeSvg,
  "exercicios": Dumbbell,
  "loja": Loja
}

export function TabBarIcon({ name, focused }: PropsTabICon) {
  const marginBottom = useSharedValue(0);
  const Icone = icons[name];
  
  useEffect(() => {
    if(focused)
      marginBottom.value = withSpring(marginBottom.value + 1)
    else if (!focused && marginBottom.value > 0 )
      marginBottom.value = withSpring(marginBottom.value - 1)
  }, [focused])

  return (
    <View style={[focused ? styles.focused : styles.notFocused]}>
        <Icone cor={focused ? colors.verde.padrao2 : colors.cinza.medio2} containerProps={{style:{width: 30, aspectRatio: 1}}}/>
    </View>
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
    backgroundColor: colors.preto.padrao
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

