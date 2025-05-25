import { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import StyledText from "./base/styledText";
import { colors } from "@/constants/Colors";

interface Props{
    icone: ReactNode
    title: string
    text: string
}

export default function CardSplashInicial({icone, title, text}:Props){
    return (
        <View style={styles.container}>
            <View style={styles.cabecalho}>
                <View style={styles.containerIcone}>
                    {icone}
                </View>
                <StyledText style={styles.titulo}>{title}</StyledText>
            </View>

            <StyledText style={styles.texto}>{text}</StyledText>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        backgroundColor: colors.cinza.medio4,
        borderRadius: 15,
        alignItems: 'center',
        padding: 15,
        width: '100%'
    },
    cabecalho:{
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 15,
        alignItems: 'center' 
    },
    containerIcone:{
        height: 30,
        aspectRatio: 1
    },
    titulo: {
        fontSize: 23,
        color: colors.branco.padrao
    },
    texto:{
        color: colors.cinza.medio3,
        textAlign: 'center'
    }

});