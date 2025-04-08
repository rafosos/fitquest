import { AntDesign, Entypo, Feather } from "@expo/vector-icons"
import { StyleSheet, View } from "react-native"
import StyledText from "./styledText"
import { colors } from "@/constants/Colors"
import { fonts } from "@/constants/Fonts"

interface HeaderProps{
    onClose: () => void,
    titulo: string,
    onDelete?: () => void,
    showDelete?: boolean,
    showSair?: boolean
}

export function HeaderPaginaDetalhes({onClose, titulo, onDelete, showDelete = true, showSair}: HeaderProps){

    return(
        <View style={styles.titleContainer}>
            <AntDesign name="arrowleft" size={30} color={colors.branco.padrao} onPress={onClose} style={[styles.iconeVoltar, !showDelete && styles.fixedVoltar]}/>
            <StyledText style={styles.title}>{titulo}</StyledText>
            {showSair ? 
                <Entypo name="log-out" style={styles.botaoApagar} onPress={onDelete}/>
                :
                showDelete && <Feather name="trash-2" style={styles.botaoApagar} onPress={onDelete}/>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    titleContainer: {
        paddingVertical: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconeVoltar:{

    },
    title: {
        fontSize: 16,
        color: colors.branco.padrao,
        fontFamily: fonts.padrao.Bold700,
        flex:1,
        textAlignVertical: "center",
        textAlign: "center",
    },
    botaoApagar:{
        color: colors.branco.padrao,
        fontSize: 24
    },
    fixedVoltar:{
        position: 'absolute',
        top: 7,
        left: 3
    }
})