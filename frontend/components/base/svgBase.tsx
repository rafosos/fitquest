import { ReactNode } from "react"
import { View, ViewProps } from "react-native"
import Svg from "react-native-svg"

interface Props{
    path: ReactNode[]
    containerProps?: ViewProps
}

export default function SvgBase({containerProps, path}:Props){
    return (    
        <View {...containerProps}>
            <Svg width="100%" height="100%" viewBox="0 0 150 150" fill="none">
                {path}
            </Svg>
        </View>
    )
}