import { ExercicioCampeonatoTreino, ExercicioCard } from "@/classes/campeonato"
import Exercicio from "@/classes/exercicio"
import { colors } from "@/constants/Colors"
import Checkbox from "expo-checkbox"
import { ActivityIndicator, FlatList, StyleSheet, TouchableOpacity, View } from "react-native"
import CardExercicio from "./CardExercicio"

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

                    <CardExercicio item={item} />

                    
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
    loading:{
        flex:1
    }
})