import { ExercicioCampeonatoTreino } from "@/classes/campeonato"
import Exercicio from "@/classes/exercicio"
import StyledText from "@/components/base/styledText"
import { colors } from "@/constants/Colors"
import { fonts } from "@/constants/Fonts"
import Checkbox from "expo-checkbox"
import { ActivityIndicator, FlatList, StyleSheet, TouchableOpacity, View } from "react-native"

interface Props{
    exercicios: Exercicio[] | ExercicioCampeonatoTreino[],
    novoTreino: boolean,
    checkboxes?: boolean[],
    selecionados?: boolean,
    refreshing?: boolean,
    setCheckboxes?: (valor: boolean[]) => void
}

export default function ListaExercicios({exercicios, checkboxes = [], setCheckboxes = () => null, novoTreino, refreshing = false, selecionados = false}: Props){
    
    const checkExercicio = (value: boolean, index: number) => {
        checkboxes[index] = value;        
        setCheckboxes([...checkboxes]);
    }

    const convertExercicioFlatlist = (e: Exercicio | ExercicioCampeonatoTreino) => {
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
    

    return (
        <FlatList
            data={getData()}
            maintainVisibleContentPosition={{minIndexForVisible: 7}} //TODO: fix this RN issue - make cards a component which hold their own state, and the list will be a list of components
            contentContainerStyle={styles.container}
            onStartShouldSetResponder={() => true}
            renderItem={({item, index}) => 
                <TouchableOpacity
                    activeOpacity={1}
                    style={styles.containerItem} 
                    onPress={() => novoTreino ? checkExercicio(!checkboxes[index], index) : null}
                >
                    {novoTreino && 
                        <View style={styles.containerCheckbox}>
                            <Checkbox 
                                value={checkboxes[index]}
                                onValueChange={(value) => checkExercicio(value, index)}
                            />
                        </View>
                    }

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
                </TouchableOpacity>
            }
            ListEmptyComponent={refreshing ? <ActivityIndicator style={styles.loading} color={colors.verde.padrao} size={"large"}/> :null}
        />

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
    loading:{
        flex:1
    }
})