import { useSession } from '@/app/ctx';
import { useRef, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Modal, FlatList, Dimensions, TouchableOpacity } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import Exercicio from '@/classes/exercicio';
import { AutocompleteDropdown, AutocompleteDropdownContextProvider, IAutocompleteDropdownRef, AutocompleteDropdownItem } from 'react-native-autocomplete-dropdown';
import RotinaService from '@/services/rotina_service';
import ExercicioService from '@/services/exercicio_service';
import { Feather } from '@expo/vector-icons';
import { colors } from '@/constants/Colors';
import { errorHandlerDebug } from '@/services/service_config';
import ErroInput from './ErroInput';


export default function AddRotinaModal({ isVisible = false, onClose = () => {} }) {
    const [nome, setNome] = useState("");
    const [duracao, setDuracao] = useState(0);
    const [exercicios, setExercicios] = useState<Exercicio[]>([]);
    const [resultados, setResultados] = useState<Exercicio[]>([]);
    const [loading, setLoading] = useState(false);
    const [erros, setErros] = useState<any>({});
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

        let erroObj = {...erros};

        // checagem de erros
        erroObj = {...erros,
            nome: !nome,
            dias: !duracao,
            exercicios: !exercicios.length,
            seriesRepeticoes: exercicios.some(exec => exec.qtd_repeticoes <= 0 || exec.qtd_serie <= 0)
        };
        setErros(erroObj);        

        // se algum erro existe, a função .some vai voltar true e não vai chamar submit
        if(Object.values(erroObj).some(err => err)) return;

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
            <View style={styles.container}>
                <FlatList
                    removeClippedSubviews={false}
                    keyboardShouldPersistTaps="always"
                    automaticallyAdjustKeyboardInsets
                    ListHeaderComponent={<>
                        <View style={styles.titleContainer}>
                            <AntDesign name="arrowleft" size={30} color={colors.branco.padrao} onPress={onClose}/>
                            <Text style={styles.title}>Adicionar rotina</Text>
                        </View>

                        <View>
                            <TextInput
                                placeholder='Nome da rotina'
                                value={nome}
                                placeholderTextColor={erros.nome ? colors.vermelho.erro : colors.branco.padrao}
                                onChangeText={(txt) => setNome(txt)}
                                style={[styles.input, erros.nome && styles.erroInput]}
                                onBlur={() => setErros({...erros, "nome": !nome})}
                                />

                            <ErroInput 
                                show={erros.nome}
                                texto="O campo nome da rotina é obrigatório!"                            
                            />

                            <View style={{flexDirection:'row', alignItems: 'center'}}>
                                <Text style={[styles.label, erros.dias && {color: colors.vermelho.erro}]}>Dias por semana:</Text>
                                <TextInput
                                    placeholderTextColor={erros.dias ? colors.vermelho.erro : colors.branco.padrao}
                                    style={[styles.input, styles.inputDuracao, erros.dias && styles.erroInput]}
                                    keyboardType='numeric'
                                    value={duracao.toString() == "0" ? "" : duracao.toString()}
                                    onChangeText={(txt) => { 
                                        const parsedQty = Number.parseInt(txt)
                                        if (Number.isNaN(parsedQty)) {
                                            setDuracao(0);
                                        } else if (parsedQty > 7) {
                                            setDuracao(7);
                                        } else 
                                        setDuracao(parsedQty);
                                    }}
                                    onBlur={() => setErros({...erros, "dias": !duracao})}
                                />
                            </View>

                            <ErroInput 
                                show={erros.dias}
                                texto="O campo duração é obrigatório e deve ser maior que 0!"                            
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
                                style: {color: colors.preto.padrao}  
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

                        <ErroInput 
                            show={erros.exercicios}
                            texto='A lista de exercícios não pode estar vazia!'
                        />
                        <ErroInput 
                            show={erros.seriesRepeticoes}
                            texto='O número de séries/repetições deve ser maior que 0!'
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
                                <Feather name="trash-2" size={22} color={colors.vermelho.padrao} onPress={() => removerExercicio(index)}/>
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
                    ListFooterComponent={
                        <TouchableOpacity onPress={submit} style={styles.botaoAdicionar}>
                            <Text style={styles.txtBotaoAdd}>ADICIONAR</Text>
                        </TouchableOpacity>
                    }
                />
            </View>
            </AutocompleteDropdownContextProvider>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.cinza.background, 
        flex:1,
        padding:10 
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        color: colors.branco.padrao
    },
    title: {
        marginLeft: 7,
        fontSize: 25,
        fontWeight: "800",
        color: colors.branco.padrao
    },
    inputAutocomplete:{
        borderWidth: 1,
        borderColor: colors.preto.padrao,
        borderRadius: 4,
    },
    label:{
        color: colors.branco.padrao,
        fontSize: 16,
        textAlignVertical: 'bottom'
    },
    input: {
        borderBottomWidth: 1,
        borderColor: colors.branco.padrao,
        padding: 10,
        color: colors.branco.padrao,
        marginBottom: 10,
        borderRadius: 4,
        fontWeight: "500"
    },
    erroInput:{
        borderColor: colors.vermelho.erro
    },
    inputDuracao:{
        width: 40, 
        textAlign: 'center'
    },
    subTitulo:{
        color: colors.branco.padrao,
        fontSize: 18,
        fontWeight: "800",
        marginTop: 10
    },
    inputCard: {
        borderBottomWidth: 1,
        borderColor: colors.preto.fade["3"],
        padding: 10,
        textAlign: 'center',
        marginVertical: 10,
        fontWeight: "500"
    },
    cardExercicio:{
        borderWidth: 1,
        borderColor: colors.preto.padrao,
        backgroundColor: colors.branco.padrao,
        padding: 10,
        marginVertical: 10,
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
    },
    botaoAdicionar: {
        backgroundColor: colors.verde.padrao,
        borderRadius: 15,
        marginVertical: 10,
        padding: 5
    },
    txtBotaoAdd:{
        color: colors.branco.padrao,
        textAlign: 'center',
        fontSize: 18
    }
});
  