import { AntDesign, Feather } from "@expo/vector-icons"
import { StyleSheet, View } from "react-native"
import StyledText from "./styledText"
import { colors } from "@/constants/Colors"
import { fonts } from "@/constants/Fonts"

interface HeaderProps{
    onClose: () => void,
    titulo: string,
    onDelete: () => void,
    showDelete?: boolean
}

export function HeaderPaginaDetalhes({onClose, titulo, onDelete, showDelete = true}: HeaderProps){

    return(
        <View style={styles.titleContainer}>
            <AntDesign name="arrowleft" size={30} color={colors.branco.padrao} onPress={onClose} style={styles.iconeVoltar}/>
            <StyledText style={styles.title}>{titulo}</StyledText>
            {showDelete && <Feather name="trash-2" style={styles.botaoApagar} onPress={onDelete}/>}
        </View>
    )
}

const styles = StyleSheet.create({
    titleContainer: {
        paddingVertical: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    iconeVoltar:{

    },
    title: {
        fontSize: 16,
        color: colors.branco.padrao,
        fontFamily: fonts.padrao.Bold700,
        textAlign: "center"
    },
    botaoApagar:{
        color: colors.branco.padrao,
        fontSize: 24
    },
})