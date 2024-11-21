import { fonts } from "@/constants/Fonts";
import { Text, TextProps } from "react-native";

export default function StyledText({style, children, ...props}: TextProps){
    return <Text style={[{fontFamily: fonts.padrao.Regular400}, style]} {...props}>{children}</Text>
} 