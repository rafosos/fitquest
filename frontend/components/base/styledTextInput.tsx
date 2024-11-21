import { fonts } from "@/constants/Fonts";
import { ForwardedRef, forwardRef } from "react";
import { TextInput, TextInputProps } from "react-native";

const StyledTextInput = forwardRef(function ({style, ...props}: TextInputProps, ref: ForwardedRef<TextInput>){
    return <TextInput ref={ref} style={[{fontFamily: fonts.padrao.Regular400}, style]} {...props} />
})

export default StyledTextInput;