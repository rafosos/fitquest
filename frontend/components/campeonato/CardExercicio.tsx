import { FlatList, StyleSheet, View } from "react-native";
import StyledText from "../base/styledText";
import { ExercicioCard } from "@/classes/campeonato";
import { fonts } from "@/constants/Fonts";
import { colors } from "@/constants/Colors";
import Checkbox from "expo-checkbox";
import StyledTextInput from "../base/styledTextInput";
import { useState } from "react";
import { useToast } from "react-native-toast-notifications";

interface Props{
    item: ExercicioCard,
    setTimer: (tempo: number) => void,
    showDescanso?: boolean
}

export default function CardExercicio({item, setTimer, showDescanso = false}: Props){
    const [tempo, setTempo] = useState(0);
    const [checkboxes, setCheckboxes] = useState<boolean[]>(Array(item.qtd_serie).fill(false));

    const toast = useToast();

    const onChangeTempo = (txt: string) => {
        const valor = Number(txt);
        if(!Number.isNaN(valor)){
            if(valor == 0){
                toast.show("O tempo setado para o descanso é 0s.");
            }
            setTempo(valor);
        }
    }

    const onCheckboxMarked = (value: boolean, index: number) => {
        setTimer(tempo);
        checkboxes[index] = value;
        setCheckboxes([...checkboxes]);
    }

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

            {showDescanso ?<>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <View style={styles.containerPausa}>
                        <StyledText>Pausa:</StyledText>
                        <StyledTextInput
                            style={styles.inputTempo}
                            keyboardType="numeric"
                            value={tempo.toString()}
                            onChangeText={(txt) => onChangeTempo(txt)}
                        />
                            <StyledText>s</StyledText>
                    </View>
                </View>

                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                    <StyledText>Séries</StyledText>

                    <FlatList 
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        data={checkboxes}
                        renderItem={({item: i, index}) =>
                            <View style={styles.checkboxSerie}>
                                <StyledText>{index+1}º</StyledText>
                                <Checkbox value={i} onValueChange={(value) => onCheckboxMarked(value, index)}/>
                            </View>
                        }
                    />
                </View>
            </>: null}
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
    },
    containerPausa:{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        marginTop: 15
    },
    inputTempo:{
        borderBottomWidth: 1,
        borderBottomColor: colors.cinza.escuro,
        paddingBottom: 0
    },
    checkboxSerie:{
        marginHorizontal: 15
    }
})