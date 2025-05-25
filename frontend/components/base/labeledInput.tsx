import { colors } from "@/constants/Colors";
import React, { ReactElement, ReactNode } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import StyledText from "@/components/base/styledText";
import ErroInput from "@/components/ErroInput";

interface Props {
    label: string,
    inputComponent: ReactNode,
    erroStyle?: ViewStyle,
    errors?: ReactElement<typeof ErroInput>[] 
}

export default class LabeledInput extends React.Component<Props>{
    render(){
        const {label, inputComponent, erroStyle, errors} = this.props;
        return(<>
            <View style={styles.containerInput} key={label}>
                <StyledText style={[styles.label, erroStyle]}>{label}</StyledText>
                {inputComponent}
                {errors}
            </View>
        </>
        )
    }
}

const styles = StyleSheet.create({
    containerInput:{
        width: '100%',
    },
    label:{
        color: colors.cinza.medio3
    },
})