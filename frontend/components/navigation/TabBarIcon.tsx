
import Ionicons from '@expo/vector-icons/Ionicons';
import { ComponentProps, useEffect } from 'react';
import { StyleProp, Text, View } from 'react-native';
import Animated, { useSharedValue, withSpring } from 'react-native-reanimated';

interface PropsTabICon{
  focused: boolean,
  name: ComponentProps<typeof Ionicons>['name']
}

export function TabBarIcon({ name, focused }: PropsTabICon) {
  const marginBottom = useSharedValue(0);
  
  useEffect(() => {
    console.log(focused)
    if(focused)
      marginBottom.value = withSpring(marginBottom.value + 1)
    else if (!focused && marginBottom.value > 0 )
      marginBottom.value = withSpring(marginBottom.value - 1)
  }, [focused])

  return (
    <View style={{ marginBottom: 18}}>
      {/* <Animated.Text style={{ marginBottom }}><Ionicons name={name} size={28} /></Animated.Text> */}
      {/* <Text style={{ paddingBottom: 18 }}> */}
        <Ionicons style={{alignSelf: 'center'}} name={name} size={28} />
      {/* </Text> */}
    </View>
  )
}

