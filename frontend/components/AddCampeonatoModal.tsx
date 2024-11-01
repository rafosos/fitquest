import React, { useCallback, useEffect } from "react";
import AntDesign from '@expo/vector-icons/AntDesign';
import { useSession } from '@/app/ctx';
import Campeonato, { ExercicioCampeonato } from '@/classes/campeonato';
import CampeonatoService from '@/services/campeonato_service';
import UserService from '@/services/user_service';
import { useRef, useState } from 'react';
import { View, Text, StyleSheet, Button, TextInput, Dimensions, FlatList, TouchableOpacity, Platform, Modal } from 'react-native';
import { AutocompleteDropdown, AutocompleteDropdownContextProvider, IAutocompleteDropdownRef, AutocompleteDropdownItem } from 'react-native-autocomplete-dropdown';
import { Feather } from "@expo/vector-icons";
import { colors } from "@/constants/Colors";
import RNDateTimePicker, { DateTimePickerAndroid, DateTimePickerEvent } from "@react-native-community/datetimepicker";
import Exercicio from "@/classes/exercicio";
import ExercicioService from "@/services/exercicio_service";
import { errorHandlerDebug } from "@/services/service_config";

export default function AddCampeonatoModal({ isVisible = false, onClose = () => {} }) {
    const { id: userId } = JSON.parse(useSession().user ?? "{id: null}");
    const [exercicios, setExercicios] = useState<Exercicio[]>([]);
    const [resultados, setResultados] = useState<Exercicio[]>([]);
    const [nome, setNome] = useState("");
    const [datePicker, setDatePicker] = useState(false);
    const [dataFinal, setDataFinal] = useState(new Date(Date.now() + 12096e5));
    const [participantes, setParticipantes] = useState<AutocompleteDropdownItem[]>([]);
    const [loadingAmigos, setLoadingAmigos] = useState(false);
    const [loadingExercicios, setLoadingExercicios] = useState(false);
    const [amigos, setAmigos] = useState<AutocompleteDropdownItem[]>([]);

    const userService = UserService();
    const campeonatoService = CampeonatoService();
    const exercicioService = ExercicioService();

    const dropdownController = useRef<IAutocompleteDropdownRef | null>(null);
    const dropdownExecController = useRef<IAutocompleteDropdownRef | null>(null);

    useEffect(() => {
        if (Platform.OS == "android" && datePicker)
            DateTimePickerAndroid.open({
                mode: "date",
                value: dataFinal,
                onChange: handleDatePickerChange
        })
    }, [datePicker]);

    const clearAndClose = () =>{
        setNome("");
        onClose();
    }

    const getUsersDropdown = (f: string) => {
        if(!userId) return;

        if (!f.length) {
            setAmigos([]);
            return;
        }

        setLoadingAmigos(true);
        userService.getAmigosFilter(userId, f)
            .then(res => setAmigos(res.map(user => {return {id: user.id.toString(), title:user.fullname}})))
            .catch(err => console.log(err))
            .finally(() => setLoadingAmigos(false));
    }

    const onClearPress = useCallback(() => setAmigos([]), [])

    const submit = () => {
        campeonatoService.addCampeonato(
            {nome, 
                duracao: new Date(dataFinal), 
                participantes_ids: [...participantes.map(p => Number(p.id)), Number(userId)],
                exercicios:[...exercicios.map(e => new ExercicioCampeonato(e.id, e.qtd_serie, e.qtd_repeticoes))]
            })
            .then(res => clearAndClose())
            .catch(err => errorHandlerDebug(err));
    }

    const removerParticipante = (item: AutocompleteDropdownItem) => {
        participantes.splice(participantes.findIndex(p => p.id == item.id), 1);
        setParticipantes([...participantes]);
    }

    const handleDatePickerChange = (e: DateTimePickerEvent , data?: Date) => {
        if (e.type == "set" && data)
            setDataFinal(data);
        setDatePicker(false);
    }

    const getExerciciosDropdown = (f: string) => {
        if (!f.length) {
            setResultados([]);
            return;
        }

        setLoadingExercicios(true);
        exercicioService.getExercicioFiltro(Number(userId), f, exercicios.map(e => e.id))
            .then(res => setResultados(res.map(exec => {return {...exec, id: exec.id, title:exec.nome}})))
            .catch(error => errorHandlerDebug(error))
            .finally(() => setLoadingExercicios(false));
    }

    const onSelectItem = (item: AutocompleteDropdownItem | null) => {
        if(!item) return
        const e = resultados.splice(resultados.findIndex((r) => r.id.toString() == item.id),1);
        if(!e) return;
        setExercicios([...exercicios, ...e]);
        setResultados([...resultados]);
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

    const removerExercicio = (index: number) => {
        exercicios.splice(index,1);
        setExercicios([...exercicios]);
    }

    return (
        <Modal 
            visible={isVisible}
            transparent={false}
            onRequestClose={onClose}
            style={styles.modal}
        >
            <AutocompleteDropdownContextProvider>
                
            <FlatList
                data={exercicios}
                ListHeaderComponent={<>
                    <View style={styles.titleContainer}>
                        <AntDesign name="arrowleft" size={30} color={colors.preto.padrao} onPress={onClose}/>                            
                        <Text style={styles.title}>Novo campeonato</Text>
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Nome</Text>
                        <TextInput
                            placeholder='Nome'
                            value={nome}
                            style={styles.input}
                            onChangeText={(txt) => setNome(txt)}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Data final</Text>
                        <TouchableOpacity
                            style={styles.input}
                            onPress={() => setDatePicker(true)}
                        >
                            <TextInput 
                                placeholder="Data final"
                                value={`${dataFinal.getDate()}/${dataFinal.getMonth()}/${dataFinal.getFullYear()}`}
                                editable={false}
                                style={{color: colors.preto.padrao}}
                            />
                        </TouchableOpacity>
                        {(datePicker && Platform.OS != "android") &&
                            <RNDateTimePicker
                            mode="date"
                            onChange={handleDatePickerChange}
                            value={dataFinal}
                            />
                        }
                    </View>

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
                        inputContainerStyle={{
                            ...styles.inputAutocomplete,
                            backgroundColor: colors.branco.padrao
                        }}
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
                                <Text>{user.title}</Text>
                                <AntDesign name="closecircle" size={15} color="black" style={{marginLeft: 5}}/>
                            </TouchableOpacity>
                        )}
                    </View>
            
                    <AutocompleteDropdown
                        controller={controller => dropdownExecController.current = controller}
                        direction={"up"}
                        dataSet={resultados.map(res => {return {...res, id: res.id.toString(), title: res.nome}})}
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
            />

            <Button
                title='Criar'
                onPress={submit}
            />
            </AutocompleteDropdownContextProvider>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modal:{
    },
    titleContainer: {
        flexDirection: "row",
        alignItems: "center",
        margin: 5
    },
    title: {
        margin: 10,
        fontSize: 20,
        fontWeight: "800"
    },
    inputContainer:{
        margin: 10,
    },
    label:{
        // marginLeft: 10
    },
    input: {
        borderWidth: 1,
        borderColor: colors.preto.padrao,
        padding: 10,
        borderRadius: 4,
    },
    containerChips:{
        flexWrap: "wrap", 
        alignItems: "flex-start",
        marginHorizontal: 10
    },
    inputAutocomplete:{
        borderWidth: 1,
        borderColor: colors.preto.padrao,
        // padding: 10,
        margin: 10,
        borderRadius: 4,
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
    inputCard: {
        borderBottomWidth: 1,
        borderColor: colors.preto.fade["3"],
        padding: 10,
        margin: 10,
        fontWeight: "500"
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
        flexDirection: "row",
    }
  });
  