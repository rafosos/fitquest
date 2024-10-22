import { useSession } from '@/app/ctx';
import { useRef, useState } from 'react';
import { View, Text, StyleSheet, Button, TextInput, Modal, FlatList, Dimensions } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import Exercicio from '@/classes/exercicio';
import { AutocompleteDropdown, AutocompleteDropdownContextProvider, IAutocompleteDropdownRef, AutocompleteDropdownItem } from 'react-native-autocomplete-dropdown';
import RotinaService from '@/services/rotina_service';
import ExercicioService from '@/services/exercicio_service';
import { Feather } from '@expo/vector-icons';
import { colors } from '@/constants/Colors';
import { errorHandlerDebug } from '@/services/service_config';


export default function AddRotinaModal({ isVisible = false, onClose = () => {} }) {
    const [nome, setNome] = useState("");
    const [duracao, setDuracao] = useState(0);
    const [exercicios, setExercicios] = useState<Exercicio[]>([]);
    const [resultados, setResultados] = useState<Exercicio[]>([]);
    const [loading, setLoading] = useState(false);
    const { id: userId } = JSON.parse(useSession().user ?? "{id: null}");

    const rotinaService = RotinaService();
    const exercicioService = ExercicioService();

    const dropdownController = useRef<IAutocompleteDropdownRef | null>(null);
    
    const clearAndClose = () =>{
        setNome("");
        setDuracao(0);
        setExercicios([]);
        setResultados([]);
        onClose();
        console.log("deu")
    }
    
    const getExerciciosDropdown = (f: string) => {
        if (!f.length) {
            setResultados([]);
            return;
        }

        setLoading(true);
        exercicioService.getExercicioFiltro(Number(userId), f, exercicios.map(e => e.id))
            .then(res => setResultados(res.map(exec => {return {...exec, id: exec.id, title:exec.nome}})))
            .catch(error => errorHandlerDebug(error))
            .finally(() => setLoading(false));
    }

    const onSelectItem = (item: AutocompleteDropdownItem) => {
        if(!item) return
        const e = resultados.splice(resultados.findIndex((r) => r.id.toString() == item.id),1);
        if(!e) return;
        setExercicios([...exercicios, ...e]);
        setResultados([...resultados]);
        dropdownController.current?.clear();
    }

    const updateSerie = (index: number, value: number) => {
        exercicios[index].qtd_serie = value;
        setExercicios([...exercicios]);
    }
 
    const updateRepeticao = (index: number, value: number) => {
        exercicios[index].qtd_repeticoes = value;
        setExercicios([...exercicios]);
    }

    const removerExercicio = (index: number) => {
        const e = exercicios.splice(index,1);
        setExercicios([...exercicios]);
    }

    const submit = () => {
        if(!userId) return

        rotinaService.addRotina(userId, {
            nome,
            dias: duracao,
            exercicios: exercicios.map(e => {return{id: e.id, series: e.qtd_serie, repeticoes: e.qtd_repeticoes}})
        }).then(res => clearAndClose())
        .catch(err => errorHandlerDebug(err));
    }

    return (
        <Modal
            animationType="slide"
            transparent={false}
            visible={isVisible}
            onRequestClose={clearAndClose}
        >
            <AutocompleteDropdownContextProvider>
                <FlatList
                    removeClippedSubviews={false}
                    keyboardShouldPersistTaps="always"
                    automaticallyAdjustKeyboardInsets
                    ListHeaderComponent={<>
                        <View style={styles.titleContainer}>
                            <AntDesign name="arrowleft" size={30} color={colors.preto.padrao} onPress={onClose}/>
                            <Text style={styles.title}>Adicionar rotina</Text>
                        </View>

                        <View>
                            <TextInput
                                placeholder='Nome da rotina'
                                value={nome}
                                onChangeText={(txt) => setNome(txt)}
                                style={styles.inputCard}
                            />

                            <TextInput
                                placeholder='Dias por semana'
                                keyboardType='numeric'
                                value={duracao.toString() == "0" ? "" : duracao.toString()}
                                onChangeText={(txt) => setDuracao(Number(txt))}
                                style={styles.inputCard}
                            />
                        </View>

                        <Text style={styles.subTitulo}>Exercicios</Text>

                        <AutocompleteDropdown
                            controller={controller => {
                                dropdownController.current = controller
                            }}
                            direction={"down"}
                            dataSet={resultados.map(res => {return {...res, id: res.id.toString(), title: res.nome}})}
                            onChangeText={getExerciciosDropdown}
                            onSelectItem={(item) => item && onSelectItem(item)}
                            debounce={600}
                            suggestionsListMaxHeight={Dimensions.get('window').height * 0.4}
                            loading={loading}
                            useFilter={false}
                            textInputProps={{
                                placeholder: 'Pesquisar exercício',
                                autoCorrect: false,
                                autoCapitalize: 'none',
                            }}
                            inputContainerStyle={{
                                ...styles.inputAutocomplete,
                                backgroundColor: colors.branco.padrao
                            }}
                            ClearIconComponent={<Feather name="x-circle" size={18} color={colors.preto.padrao} />}
                            inputHeight={50}
                            closeOnBlur={true}
                            showChevron={false}
                            clearOnFocus={false}
                            closeOnSubmit
                            EmptyResultComponent={<></>}
                        />
                    </>}
                    data={exercicios}
                    renderItem={({item, index}) => 
                        <View style={styles.cardExercicio}>
                            
                            <View style={styles.headerCard}>
                                <View style={styles.containerTituloExercicio}>
                                    <Text style={styles.tituloExercicio}>{item.nome}</Text>
                                    <Text style={styles.subTituloExercicio}>{item.grupo_muscular.nome}</Text>
                                </View>
                                <Feather name="trash-2" size={24} color="red" onPress={() => removerExercicio(index)}/>
                            </View>

                            <View style={styles.containerCamposExec}>
                                <View style={styles.containerTxtCard}>
                                    <Text style={styles.txtCard}>Séries:</Text>
                                    <TextInput
                                        value={item.qtd_serie.toString()}
                                        keyboardType='numeric'
                                        onChangeText={(txt) => updateSerie(index, Number(txt))}
                                        style={styles.inputCard}
                                        />
                                </View>

                                <View style={styles.containerTxtCard}>
                                    <Text style={styles.txtCard}>Repetições:</Text>
                                    <TextInput
                                        keyboardType='numeric'
                                        value={item.qtd_repeticoes.toString()}
                                        onChangeText={(txt) => updateRepeticao(index, Number(txt))}
                                        style={styles.inputCard}
                                        />
                                </View>
                            </View>
                        </View>
                    }
                    ListEmptyComponent={
                        <Text style={{textAlign: "center"}}>Não há exercícios.</Text>
                    }
                />
                <Button 
                    title='Adicionar'
                    onPress={submit}    
                />
            </AutocompleteDropdownContextProvider>
        </Modal>
    );
}

const styles = StyleSheet.create({
    titleContainer: {
        paddingVertical:10,    
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center'
    },
    title: {
        marginLeft: 7,
        fontSize: 25,
        fontWeight: "800"
    },
    inputAutocomplete:{
        borderWidth: 1,
        borderColor: "#000",
        // padding: 10,
        margin: 10,
        borderRadius: 4,
    },
    input: {
        borderWidth: 1,
        borderColor: "#000",
        padding: 10,
        margin: 10,
        borderRadius: 4,
        fontWeight: "500"
    },
    subTitulo:{
        fontSize: 18,
        fontWeight: "800",
        marginLeft: 10
    },
    inputCard: {
        borderBottomWidth: 1,
        borderColor: colors.preto.fade["3"],
        padding: 10,
        margin: 10,
        fontWeight: "500"
    },
    cardExercicio:{
        borderWidth: 1,
        borderColor: colors.preto.padrao,
        padding: 10,
        margin: 10,
        borderRadius: 4
    },
    headerCard:{
        flexDirection: "row",
        justifyContent: "space-between",
    },
    containerTituloExercicio:{
        flexDirection: "column"
    },
    tituloExercicio:{
        fontSize: 18,
        fontWeight: "800"
    },
    subTituloExercicio:{
        fontSize: 14,
        fontWeight: "300",
        color: colors.cinza.escuro
    },
    containerTxtCard:{
        flex:1,
        flexDirection: "row",
        alignItems: "center"
    },
    txtCard:{
        fontSize: 17
    },
    containerCamposExec: {
        flex: 1,
        flexDirection: "row"
    }
  });
  