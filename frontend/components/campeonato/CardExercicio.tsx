import { StyleSheet, View } from "react-native";
import StyledText from "../base/styledText";
import { ExercicioCard } from "@/classes/campeonato";
import { fonts } from "@/constants/Fonts";
import { colors } from "@/constants/Colors";

interface Props{
    item: ExercicioCard
}

export default function CardExercicio({item}: Props){

    return (
        <View style={styles.card}>
            <View style={styles.headerCard}>
                <View style={styles.containerColumn}>
                    <StyledText style={styles.tituloExercicio}>{item.nome}</StyledText>
                    <StyledText style={styles.subTituloExercicio}>{item.grupo_muscular_nome}</StyledText>
                </View>
            </View>

            <View style={styles.containerCamposExec}>
                <View style={styles.containerTxtCard}>
                    <StyledText style={styles.txtCard}>Séries: </StyledText>
                    <StyledText>{item.qtd_serie.toString()}</StyledText>
                </View>

                <View style={styles.containerTxtCard}>
                    <StyledText style={styles.txtCard}>Repetições: </StyledText>
                    <StyledText>{item.qtd_repeticoes.toString()}</StyledText>
                </View>
            </View>
        </View>
)}


const styles = StyleSheet.create({
    card:{
        borderWidth: 1,
        flexGrow: 1,
        borderColor: colors.preto.padrao,
        backgroundColor: colors.branco.padrao,
        padding: 10,
        margin: 10,
        borderRadius: 4
    },
    headerCard:{
        flexDirection: "row",
        justifyContent: "space-between",
    },
    containerColumn:{
        flexDirection: "column"
    },
    tituloExercicio:{
        fontSize: 18,
        fontFamily: fonts.padrao.Bold700
    },
    subTituloExercicio:{
        fontSize: 14,
        fontFamily: fonts.padrao.Regular400,
        color: colors.cinza.escuro
    },
    containerCamposExec: {
        flexDirection: "row"
    },
    containerTxtCard:{
        flex:1,
        flexDirection: "row",
        alignItems: "center"
    },
    txtCard:{
        fontSize: 17
    }
})