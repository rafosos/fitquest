import { StyleSheet, View } from "react-native";
import LabeledInput from "@/components/base/labeledInput";
import { colors } from "@/constants/Colors";
import { Fragment, ReactElement } from "react";

interface Props{
    inputList: ReactElement<typeof LabeledInput>[]
    botao: ReactElement
}

export default function BackgroundInputs({inputList, botao}:Props){
    return (
        <View style={styles.containerInputs}>
            {inputList.map(i => <Fragment key={i.key}>{i}</Fragment>)}
            {botao}
        </View>
    );
}

const styles = StyleSheet.create({
    containerInputs:{
        width: '80%',
        backgroundColor: colors.azul.escuro,
        borderRadius: 15,
        paddingVertical: 15,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        marginTop: 25,
        paddingHorizontal: 20,
    }
});