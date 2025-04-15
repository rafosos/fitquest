import React, { useCallback, useEffect } from "react";
import AntDesign from '@expo/vector-icons/AntDesign';
import { ExercicioCampeonato } from '@/classes/campeonato';
import CampeonatoService from '@/services/campeonato_service';
import UserService from '@/services/user_service';
import { useRef, useState } from 'react';
import { View, StyleSheet, Dimensions, FlatList, TouchableOpacity, Platform, Modal } from 'react-native';
import { AutocompleteDropdown, AutocompleteDropdownContextProvider, IAutocompleteDropdownRef, AutocompleteDropdownItem } from 'react-native-autocomplete-dropdown';
import { Feather } from "@expo/vector-icons";
import { colors } from "@/constants/Colors";
import RNDateTimePicker, { DateTimePickerAndroid, DateTimePickerEvent } from "@react-native-community/datetimepicker";
import ExercicioService from "@/services/exercicio_service";
import ErroInput from "../ErroInput";
import StyledText from "../base/styledText";
import { fonts } from "@/constants/Fonts";
import StyledTextInput from "../base/styledTextInput";
import { ErrorHandler } from "@/utils/ErrorHandler";
import Checkbox from "expo-checkbox";
import MapView, { Circle, MapPressEvent, Marker, MarkerDragStartEndEvent, Region } from 'react-native-maps';
import * as Location from "expo-location";
import { useToast } from "react-native-toast-notifications";
import BaseModal from "../base/modal";

const DUAS_SEMANAS = 12096e5;
const LATITUDE_DELTA_DEFAULT = 0.01898919495771878;
const LONGITUDE_DELTA_DEFAULT = 0.010768063366413116;

export default function AddCampeonatoModal({ isVisible = false, onClose = () => {} }) {
    const hoje = new Date();
    const [erros, setErros] = useState<any>({});
    const [exercicios, setExercicios] = useState<ExercicioCampeonato[]>([]);
    const [resultados, setResultados] = useState<ExercicioCampeonato[]>([]);
    const [nome, setNome] = useState("");
    const [datePicker, setDatePicker] = useState(false);
    const [dataFinal, setDataFinal] = useState(new Date(Date.now() + DUAS_SEMANAS));
    const [participantes, setParticipantes] = useState<AutocompleteDropdownItem[]>([]);
    const [loadingAmigos, setLoadingAmigos] = useState(false);
    const [checkLoc, setCheckLoc] = useState(false);
    const [loadingExercicios, setLoadingExercicios] = useState(false);
    const [amigos, setAmigos] = useState<AutocompleteDropdownItem[]>([]);
    const [localizacao, setLocalizacao] = useState<Region>();
    const [mapa, setMapa] = useState<boolean>(false);
    const [currentRegion, setCurrentRegion] = useState<Region>();

    const errorHandler = ErrorHandler();

    const toast = useToast();
    const userService = UserService();
    const campeonatoService = CampeonatoService();
    const exercicioService = ExercicioService();

    const dropdownController = useRef<IAutocompleteDropdownRef | null>(null);
    const dropdownExecController = useRef<IAutocompleteDropdownRef | null>(null);

    useEffect(() => setCurrentRegion(localizacao), [localizacao]);

    useEffect(() => {
        if (Platform.OS == "android" && datePicker)
            DateTimePickerAndroid.open({
                mode: "date",
                value: dataFinal,
                minimumDate: hoje,
                onChange: handleDatePickerChange
        })
    }, [datePicker]);

    const clearAndClose = () =>{
        setNome("");
        setParticipantes([]);
        setExercicios([]);
        setErros({});
        onClose();
    }

    const getUsersDropdown = (f: string) => {
        if (!f.length) {
            setAmigos([]);
            return;
        }

        setLoadingAmigos(true);
        userService.getAmigosFilter(f)
            .then(res => setAmigos(res.map(user => {return {id: user.id.toString(), title:user.fullname}})))
            .catch(err => errorHandler.handleError(err))
            .finally(() => setLoadingAmigos(false));
    }

    const onClearPress = useCallback(() => setAmigos([]), [])

    const submit = () => {
        let erroObj = {...erros};

        // checagem de erros
        erroObj = {...erros, 
            exercicios: !exercicios.length,
            nome: !nome,
            seriesRepeticoes: exercicios.some(exec => exec.qtd_repeticoes <= 0 || exec.qtd_serie <= 0),
            localizacao: checkLoc && !localizacao
        };
        setErros(erroObj);        

        // se algum erro existe, a função .some vai voltar true e não vai chamar submit
        if(Object.values(erroObj).some(err => err)) return;

        campeonatoService.addCampeonato(
            {nome, 
                duracao: new Date(dataFinal), 
                participantes_ids: [...participantes.map(p => Number(p.id))],
                exercicios,
                latitude: localizacao?.latitude,
                longitude: localizacao?.longitude
            })
            .then(res => clearAndClose())
            .catch(err => errorHandler.handleError(err));
    }

    const removerParticipante = (item: AutocompleteDropdownItem) => {
        participantes.splice(participantes.findIndex(p => p.id == item.id), 1);
        setParticipantes([...participantes]);
    }

    const handleDatePickerChange = (e: DateTimePickerEvent , data?: Date) => {
        if (!data) return;

        if (e.type == "set")
            setDataFinal(data);

        if (data < hoje) setErros({...erros, "data": true});
        else setErros({...erros, data: false});

        setDatePicker(false);
    }

    const getExerciciosDropdown = (f: string) => {
        if (!f.length) {
            setResultados([]);
            return;
        }

        setLoadingExercicios(true);
        exercicioService.getExercicioFiltro(f, exercicios.map(e => e.exercicio_id))
            .then(res => setResultados(res.map(exec => {return {...exec, id: exec.id, title:exec.nome}})))
            .catch(error => errorHandler.handleError(error))
            .finally(() => setLoadingExercicios(false));
    }

    const onSelectItem = (item: AutocompleteDropdownItem | null) => {
        if(!item) return

        const e = resultados.splice(resultados.findIndex((r) => r.exercicio_id.toString() == item.id),1);
        if(!e) return;
        
        setExercicios([...exercicios, ...e]);
        setResultados([...resultados]);
        setErros({...erros, exercicios: false});
        dropdownExecController.current?.clear();
    }

    const updateSerie = (index: number, value: number) => {
        exercicios[index].qtd_serie = value;
        setExercicios([...exercicios]);
    }
 
    const updateRepeticao = (index: number, value: number) => {
        exercicios[index].qtd_repeticoes = value;
        setExercicios([...exercicios]);
    }

    const updatePontos = (index: number, value: number) => {
        exercicios[index].qtd_pontos = value;
        setExercicios([...exercicios]);
    }

    const removerExercicio = (index: number) => {
        exercicios.splice(index,1);
        setExercicios([...exercicios]);
    }

    const datediff = (first: Date, second: Date) => {        
        return Math.abs(Math.round((second.getTime() - first.getTime()) / (1000 * 60 * 60 * 24))).toString();
    }

    const abrirMapa = async () => {
        if(!localizacao)
            await getUserCurrentLocation();
        
        setMapa(true);
    };

    const getUserCurrentLocation = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            toast.show('Permissão apra acesso à localização é necessária :(');
            return;
        }

        let {latitude, longitude} = (await Location.getCurrentPositionAsync({})).coords;
        const region = {longitude, latitude, latitudeDelta: LATITUDE_DELTA_DEFAULT, longitudeDelta: LONGITUDE_DELTA_DEFAULT};
        setLocalizacao(region);
    }

    const setLocFromEvent = (e: MapPressEvent | MarkerDragStartEndEvent) => {
        const {latitude, longitude} = e.nativeEvent.coordinate;
        let latitudeDelta = LATITUDE_DELTA_DEFAULT;
        let longitudeDelta = LONGITUDE_DELTA_DEFAULT;
        if(currentRegion){
            longitudeDelta = currentRegion.longitudeDelta;
            latitudeDelta = currentRegion.latitudeDelta;
        }

        setLocalizacao({latitude, longitude, latitudeDelta, longitudeDelta});
    }

    const selecionarLocal = () => {
        fecharMapa();
    }

    const fecharMapa = () => {
        setMapa(false);
    }

    return (
        <Modal 
            visible={isVisible}
            transparent={false}
            onRequestClose={onClose}
        >
            <AutocompleteDropdownContextProvider>
            <View style={styles.container}>
                
            <FlatList
                data={exercicios}
                removeClippedSubviews={false}
                keyboardShouldPersistTaps="always"
                automaticallyAdjustKeyboardInsets
                ListHeaderComponent={<>
                    <View style={styles.titleContainer}>
                        <AntDesign name="arrowleft" size={30} color={colors.branco.padrao} onPress={onClose}/>
                        <StyledText style={styles.title}>Novo campeonato</StyledText>
                    </View>

                    <View style={styles.inputContainer}>
                        <StyledText style={styles.label}>Nome</StyledText>
                        <StyledTextInput
                            placeholder='Nome'
                            value={nome}
                            onBlur={() => setErros({...erros, "inputNome": !nome})}
                            style={[styles.input, erros.inputNome && styles.inputErro]}
                            onChangeText={(txt) => setNome(txt)}
                        />
                        <ErroInput
                            show={erros.inputNome} 
                            texto="O campo nome é obrigatório!"
                        />
                    </View>

                    <View style={styles.linhaInput}>
                        <View style={{...styles.inputContainer, flex:3}}>
                            <StyledText style={styles.label}>Data final</StyledText>
                            <TouchableOpacity
                                style={[styles.input, erros.inputData && styles.inputErro]}
                                onPress={() => setDatePicker(true)}
                            >
                                <StyledTextInput
                                    placeholder="Data final"
                                    value={`${dataFinal.getDate()}/${dataFinal.getMonth()+1}/${dataFinal.getFullYear()}`}
                                    editable={false}
                                    style={{color: colors.preto.padrao}}
                                />
                            </TouchableOpacity>
                            {(datePicker && Platform.OS != "android") &&
                                <RNDateTimePicker
                                    mode="date"
                                    onChange={handleDatePickerChange}
                                    value={dataFinal}
                                    minimumDate={hoje}
                                />
                            }
                            <ErroInput
                                show={erros.data}
                                texto="A data inserida é inválida!" 
                            />
                        </View>

                        <View style={{...styles.inputContainer, flex:1}}>
                            <StyledText style={styles.label}>Dias até final</StyledText>
                            <StyledTextInput 
                                style={styles.input}
                                value={datediff(dataFinal, hoje)}
                                editable={false}
                            />
                        </View>
                    </View>

                    <View style={styles.containerLocalizacao}>
                        <View style={styles.containerCheckbox}>
                            <Checkbox style={styles.checkLocalizacao} value={checkLoc} onValueChange={setCheckLoc} />
                            <StyledText style={styles.txtLocalizacao}>Localização</StyledText>                            
                        </View>

                        {checkLoc ?
                            <TouchableOpacity style={styles.btnMapa} onPress={abrirMapa}>
                                <Feather name="map" size={20} color={colors.branco.padrao} />
                                <StyledText style={styles.txtMapa}>{localizacao ? `${localizacao.latitude.toFixed(2)}, ${localizacao.longitude.toFixed(2)}` : "Abrir mapa"}</StyledText>
                            </TouchableOpacity>
                        : null}

                        <BaseModal
                            isVisible={mapa}
                            onClose={fecharMapa}
                            styleContainer={styles.containerModalMapa}
                        >
                            <View style={styles.conteudoModalMapa}>
                                <View style={styles.cabecalhoModalMapa}>
                                    <StyledText style={styles.tituloModalMapa}>Escolher local</StyledText>
                                    <AntDesign name="close" onPress={fecharMapa} style={styles.iconeFecharModal} />
                                </View>

                                <MapView 
                                    style={{flex:1}}
                                    initialRegion={localizacao}
                                    onRegionChangeComplete={(r) => setCurrentRegion(r)}
                                    onPress={(e) => setLocFromEvent(e)}
                                >
                                    {localizacao ? <>
                                        <Marker 
                                            draggable 
                                            onDragEnd={(e) => setLocFromEvent(e)}
                                            coordinate={localizacao}
                                        />
                                        <Circle
                                            center={localizacao}
                                            radius={100}
                                            strokeWidth={2}
                                            strokeColor={colors.roxo.uva}
                                            fillColor={colors.roxo.fade[5]}
                                        /> 
                                    </> : null}
                                </MapView>

                                <TouchableOpacity style={styles.botaoSubmit} onPress={selecionarLocal}>
                                    <StyledText style={styles.txtBotaoSubmit}>SELECIONAR LOCAL</StyledText>
                                </TouchableOpacity>
                            </View>
                        </BaseModal>
                    </View>

                    <ErroInput
                        show={erros.localizacao}
                        texto="A localização deve ser escolhida se o checkbox for selecionado!" 
                    />


                    <AutocompleteDropdown
                        controller={controller => {
                            dropdownController.current = controller
                        }}
                        direction={"down"}
                        dataSet={amigos}
                        onChangeText={getUsersDropdown}
                        onSelectItem={item => {
                            if (item) 
                                setParticipantes([...participantes, item])
                            dropdownController.current?.clear()
                        }}
                        debounce={600}
                        suggestionsListMaxHeight={Dimensions.get('window').height * 0.4}
                        onClear={onClearPress}
                        loading={loadingAmigos}
                        useFilter={false}
                        textInputProps={{
                            placeholder: 'Usuários',
                            autoCorrect: false,
                            autoCapitalize: 'none',
                            style:{
                                color: colors.preto.padrao
                            }
                        }}
                        inputContainerStyle={styles.inputAutocomplete}
                        suggestionsListContainerStyle={{
                            backgroundColor: colors.branco.padrao
                        }}
                        suggestionsListTextStyle={{
                            color: colors.preto.padrao
                        }}
                        ChevronIconComponent={<Feather name="chevron-down" size={20} color="#000" />}
                        ClearIconComponent={<Feather name="x-circle" size={18} color="#000" />}
                        inputHeight={50}
                        closeOnBlur
                        showChevron={false}
                        clearOnFocus={false}
                        EmptyResultComponent={<></>}
                    />
                    
                    <View style={styles.containerChips}>
                        {participantes.map((user) => 
                            <TouchableOpacity style={styles.chip} key={user.id} onPress={() => removerParticipante(user)}>
                                <StyledText>{user.title}</StyledText>
                                <AntDesign name="closecircle" size={15} color="black" style={{marginLeft: 5}}/>
                            </TouchableOpacity>
                        )}
                    </View>

                    <StyledText style={styles.tituloSecaoExercicio}>Exercicios</StyledText>
            
                    <AutocompleteDropdown
                        controller={controller => dropdownExecController.current = controller}
                        direction={"up"}
                        dataSet={resultados.map(res => {return {...res, id: res.exercicio_id.toString(), title: res.nome}})}
                        onChangeText={getExerciciosDropdown}
                        onSelectItem={onSelectItem}
                        debounce={600}
                        suggestionsListMaxHeight={Dimensions.get('window').height * 0.4}
                        loading={loadingExercicios}
                        useFilter={false}
                        suggestionsListContainerStyle={{
                            backgroundColor: colors.branco.padrao
                        }}
                        suggestionsListTextStyle={{
                            color: colors.preto.padrao
                        }}
                        textInputProps={{
                            placeholder: 'Pesquisar exercício',
                            autoCorrect: false,
                            autoCapitalize: 'none',
                            style:{
                                color: colors.preto.padrao
                            }
                        }}
                        inputContainerStyle={[
                            styles.inputAutocomplete,
                            { marginTop: 0 },
                            (erros.exercicios || erros.seriesRepeticoes) && styles.inputErro
                        ]}
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
                        texto="A lista de exercícios não pode estar em branco!"
                    />
                    <ErroInput 
                        show={erros.seriesRepeticoes}
                        texto="O valor de série/repetição não pode ser 0!"
                    />

                </>}
                renderItem={({item, index}) => 
                    <View style={styles.cardExercicio}>
                        
                        <View style={styles.headerCard}>
                            <View style={styles.containerTituloExercicio}>
                                <StyledText style={styles.tituloExercicio}>{item.nome}</StyledText>
                                <StyledText style={styles.subTituloExercicio}>{item.grupo_muscular.nome}</StyledText>
                            </View>
                            <Feather name="trash-2" size={24} color="red" onPress={() => removerExercicio(index)}/>
                        </View>

                        <View style={styles.containerCamposExec}>
                            <View style={styles.containerTxtCard}>
                                <StyledText style={styles.txtCard}>Séries:</StyledText>
                                <StyledTextInput
                                    value={item.qtd_serie.toString()}
                                    keyboardType='numeric'
                                    onChangeText={(txt) => updateSerie(index, Number(txt))}
                                    style={styles.inputCard}
                                />
                            </View>

                            <View style={styles.containerTxtCard}>
                                <StyledText style={styles.txtCard}>Repetições:</StyledText>
                                <StyledTextInput
                                    keyboardType='numeric'
                                    value={item.qtd_repeticoes.toString()}
                                    onChangeText={(txt) => updateRepeticao(index, Number(txt))}
                                    style={styles.inputCard}
                                    />
                            </View>

                            <View style={styles.containerTxtCard}>
                                <StyledText style={styles.txtCard}>Pontos:</StyledText>
                                <StyledTextInput
                                    value={item.qtd_pontos.toString()}
                                    keyboardType='numeric'
                                    onChangeText={(txt) => updatePontos(index, Number(txt))}
                                    style={styles.inputCard}
                                />
                            </View>
                        </View>
                    </View>
                }
                ListFooterComponent={
                    <TouchableOpacity onPress={submit} style={styles.botaoSubmit}>
                        <StyledText style={styles.txtBotaoSubmit}>CRIAR CAMPEONATO</StyledText>
                    </TouchableOpacity>
                }
            />

            </View>
            </AutocompleteDropdownContextProvider>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: colors.cinza.background
    },
    titleContainer: {
        flexDirection: "row",
        alignItems: "center",
        margin: 5,
        color: colors.branco.padrao
    },
    title: {
        margin: 10,
        fontSize: 20,
        fontFamily: fonts.padrao.Bold700,
        color: colors.branco.padrao
    },
    linhaInput:{
        flexDirection: 'row'
    },
    inputContainer:{
        margin: 10,
    },
    label:{
        color: colors.branco.padrao
    },
    input: {
        color: colors.preto.padrao,
        borderWidth: 1,
        borderColor: colors.branco.padrao,
        padding: 10,
        borderRadius: 15,
        backgroundColor: colors.branco.padrao
    },
    inputErro:{
        borderColor: colors.vermelho.padrao
    },
    containerLocalizacao:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    containerCheckbox:{
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 13,
        gap: 10,
        paddingVertical: 20 
    },
    checkLocalizacao:{

    },
    txtLocalizacao:{
        color: colors.branco.padrao
    },
    btnMapa:{
        flexDirection: 'row',
        gap: 7,
        backgroundColor: colors.verde.padrao,
        padding: 10,
        borderRadius: 25,
        alignItems: 'center',
        marginHorizontal: 10,
        marginVertical: 10
    },
    txtMapa:{
        color: colors.branco.padrao
    },
    containerModalMapa:{
        marginVertical: "10%"
    },
    conteudoModalMapa:{
        height: "100%", 
        justifyContent: 'space-between'
    },
    cabecalhoModalMapa:{ 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        gap: 7, 
        padding: 10
    },
    tituloModalMapa: {
        fontSize: 20, 
        textAlign: 'center'
    },
    iconeFecharModal:{
        fontSize: 24, 
        color: colors.preto.padrao
    },
    containerChips:{
        flexDirection: 'row',
        flexWrap: "wrap",
        alignItems: "flex-start",
        marginHorizontal: 10
    },
    inputAutocomplete:{
        borderWidth: 1,
        backgroundColor: colors.branco.padrao,
        borderColor: colors.preto.padrao,
        margin: 10,
        borderRadius: 15,
    },
    chip:{
        backgroundColor: colors.cinza.medio,
        borderRadius: 25,
        flexDirection: "row",
        padding: 10,
        alignItems: "center",
        justifyContent: "center",
        textAlignVertical: "center"
    },
    tituloSecaoExercicio:{
        marginLeft: 10,
        marginTop: 10,
        color: colors.branco.padrao,
        fontSize: 20,
        fontFamily: fonts.padrao.Medium500
    },
    cardExercicio:{
        borderWidth: 1,
        borderColor: colors.branco.padrao,
        backgroundColor: colors.branco.padrao,
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
        fontFamily: fonts.padrao.Bold700
    },
    subTituloExercicio:{
        fontSize: 14,
        fontFamily: fonts.padrao.Light300,
        color: colors.cinza.escuro
    },
    containerCamposExec: {
        flexDirection: "row",
        flex: 1,
        justifyContent: 'space-between',
    },
    containerTxtCard:{
        flexDirection: "row",
        alignItems: "center"
    },
    txtCard:{
        fontSize: 15
    },
    inputCard: {
        borderBottomWidth: 1,
        borderColor: colors.preto.fade["3"],
        padding: 5,
        margin: 5,
        fontFamily: fonts.padrao.Medium500
    },
    botaoSubmit:{
        backgroundColor: colors.verde.padrao,
        padding:10,
        borderRadius: 25,
        alignItems: 'center',
        marginHorizontal: 10,
        marginVertical: 10
    },
    txtBotaoSubmit:{
        color: colors.branco.padrao
    }
  });
  