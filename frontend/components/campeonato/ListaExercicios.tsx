import { ExercicioCampeonatoTreino, ExercicioCard } from "@/classes/campeonato"
import Exercicio from "@/classes/exercicio"
import { colors } from "@/constants/Colors"
import Checkbox from "expo-checkbox"
import { ActivityIndicator, FlatList, StyleSheet, TouchableOpacity, View } from "react-native"
import CardExercicio from "./CardExercicio"
import { useEffect, useState } from "react"
import StyledText from "../base/styledText"
import * as Progress from 'react-native-progress';

interface Props{
    exercicios: Exercicio[] | ExercicioCampeonatoTreino[],
    novoTreino: boolean,
    checkboxes?: boolean[],
    selecionados?: boolean,
    refreshing?: boolean,
    setCheckboxes?: (valor: boolean[]) => void
}

export default function ListaExercicios({exercicios, checkboxes = [], setCheckboxes = () => null, novoTreino, refreshing = false, selecionados = false}: Props){
    const [tempo, setTempo] = useState(0);
    const [tempoInicial, setTempoInicial] = useState(0);

    const checkExercicio = (value: boolean, index: number) => {
        checkboxes[index] = value;        
        setCheckboxes([...checkboxes]);
    }

    const convertExercicioFlatlist = (e: Exercicio | ExercicioCampeonatoTreino): ExercicioCard => {
        return {
            id: e.id, 
            nome: e.nome, 
            grupo_muscular_nome: e.grupo_muscular_nome, 
            qtd_serie: e.qtd_serie,
            qtd_repeticoes: e.qtd_repeticoes
        }
    }

    const getData = () => {
        if (selecionados)
            return exercicios.filter((e, i) => checkboxes[i]).map(convertExercicioFlatlist)
        return exercicios.map(convertExercicioFlatlist)
    }

    useEffect(() => {
        if (tempo > 0){
            setTimeout(() => {
                if(tempo >= 1)
                    setTempo(tempo-1)
            } , 1000);
        }
    }, [tempo]);

    const setTimer = (valor: number) => {
        setTempo(valor);
        setTempoInicial(valor);
    }    

    return (
        <View style={{flex:1}}>
            <FlatList
                data={getData()}
                maintainVisibleContentPosition={{minIndexForVisible: 7}} //TODO: fix this RN issue - make cards a component which hold their own state, and the list will be a list of components
                contentContainerStyle={styles.container}
                onStartShouldSetResponder={() => true}
                renderItem={({item, index}) => 
                    <View style={styles.containerItem}>
                        {novoTreino &&
                            <TouchableOpacity 
                                activeOpacity={1}
                                onPress={() => novoTreino ? checkExercicio(!checkboxes[index], index) : null}
                                style={styles.containerCheckbox}
                            >
                                <Checkbox 
                                    value={checkboxes[index]}
                                    onValueChange={(value) => checkExercicio(value, index)}
                                    />
                            </TouchableOpacity>
                        }

                        <CardExercicio showDescanso={novoTreino} item={item} setTimer={setTimer} />
                    </View>
                }
                ListEmptyComponent={refreshing ? <ActivityIndicator style={styles.loading} color={colors.verde.padrao} size={"large"}/> :null}
            />

            {tempo > 0 ? 
                <View style={styles.containerTimer}>
                    <StyledText style={styles.txtTempo}>Tempo de descanso: {tempo}s</StyledText>
                    <Progress.Bar
                        style={styles.progressBar}
                        color={colors.branco.padrao} 
                        progress={1 - ((tempo * 100) / tempoInicial / 100)} 
                    />
                </View> 
            :null}
        </View>
    )
}

const styles = StyleSheet.create({
    containerItem:{
        flexDirection: "row",
        marginLeft: 5,
        alignItems: "center"
    },
    containerCheckbox:{},
    container:{
        paddingHorizontal: 5
    },
    loading:{
        flex:1
    },
    containerTimer:{
        padding: 15,
        alignItems: 'center',
        justifyContent: 'center'
    },
    txtTempo:{
        color: colors.branco.padrao
    },
    progressBar:{
        marginTop: 8,
        width: '100%',
        height: 5
    }
})