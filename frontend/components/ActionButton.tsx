import { colors } from "@/constants/Colors";
import { fonts } from "@/constants/Fonts";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from "react-native";
import StyledText from "./base/styledText";

interface Props{
    onPress: () => void
    text: string
    cor: 'verde' | 'cinza'
    loading?: boolean
}

export default function ActionButton({onPress, text, cor, loading}: Props){

    const getColorScheme = () => {
        const verde = cor == "verde";
        return {
            backgroundColor: verde ? colors.verde.padrao2 : colors.cinza.medio3,
            color: verde ? colors.preto.padrao : colors.branco.padrao
        }
    }

    return(
        <TouchableOpacity style={[styles.botaoEntrar, getColorScheme()]} onPress={onPress}>
            {loading ? 
                <ActivityIndicator size={"small"} color={cor == "verde" ? colors.verde.padrao : colors.cinza.escuro}/> 
            :
                <StyledText style={[styles.txtBotaoEntrar, getColorScheme()]}>{text}</StyledText>
            }
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    botaoEntrar:{
        backgroundColor: colors.verde.padrao2,
        padding: 10,
        paddingHorizontal: 25,
        alignItems: 'center',
        borderRadius: 15,
        marginTop: 5
    },
    txtBotaoEntrar:{
        fontFamily: fonts.padrao.Bold700,
        color: colors.preto.padrao,
    },
})