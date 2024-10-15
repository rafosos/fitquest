import React, { useCallback, useEffect } from "react";
import AntDesign from '@expo/vector-icons/AntDesign';
import { useSession } from '@/app/ctx';
import Campeonato from '@/classes/campeonato';
import CampeonatoService from '@/services/campeonato_service';
import UserService from '@/services/user_service';
import { useRef, useState } from 'react';
import { View, Text, StyleSheet, Button, TextInput, Dimensions, FlatList, TouchableOpacity, Platform } from 'react-native';
import { AutocompleteDropdown, AutocompleteDropdownContextProvider, AutocompleteDropdownRef, TAutocompleteDropdownItem } from 'react-native-autocomplete-dropdown';
import { Feather } from "@expo/vector-icons";
import BaseModal from "./base/modal";
import { colors } from "@/constants/Colors";
import RNDateTimePicker, { DateTimePickerAndroid, DateTimePickerEvent } from "@react-native-community/datetimepicker";

export default function AddCampeonatoModal({ isVisible = false, onClose = () => {} }) {
    const { id: userId } = JSON.parse(useSession().user ?? "{id: null}");
    const [nome, setNome] = useState("");
    const [datePicker, setDatePicker] = useState(false);
    const [dataFinal, setDataFinal] = useState(new Date(Date.now() + 12096e5));
    const [participantes, setParticipantes] = useState<TAutocompleteDropdownItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [amigos, setAmigos] = useState<TAutocompleteDropdownItem[]>([]);

    const userService = UserService();
    const campeonatoService = CampeonatoService();

    const dropdownController = useRef<AutocompleteDropdownRef | null>(null);

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

        setLoading(true);
        userService.getAmigosFilter(userId, f)
            .then(res => setAmigos(res.map(user => {return {id: user.id.toString(), title:user.fullname}})))
            .catch(err => console.log(err))
            .finally(() => setLoading(false));
    }

    const onClearPress = useCallback(() => setAmigos([]), [])

    const submit = () => {
        campeonatoService.addCampeonato(new Campeonato(nome, new Date(dataFinal), [...participantes.map(p => Number(p.id)), Number(userId)]))
            .then(res => clearAndClose())
            .catch(err => console.log(err));
    }

    const removerParticipante = (item: TAutocompleteDropdownItem) => {
        participantes.splice(participantes.findIndex(p => p.id == item.id), 1);
        setParticipantes([...participantes]);
    }

    const handleDatePickerChange = (e: DateTimePickerEvent , data?: Date) => {
        if (e.type == "set" && data)
            setDataFinal(data);
        setDatePicker(false);
    }


    return (
        <BaseModal 
        isVisible={isVisible}
        onClose={onClose}
        >
            <AutocompleteDropdownContextProvider>

            <View style={styles.titleContainer}>
                <Text style={styles.title}>Criar campeonato</Text>
            </View>

            <TextInput
                placeholder='nome'
                value={nome}
                style={styles.input}
                onChangeText={(txt) => setNome(txt)}
            />

            <TouchableOpacity
                style={styles.input}
                onPress={() => setDatePicker(true)}
            >
                <TextInput 
                    placeholder="Data final"
                    value={`${dataFinal.getDate()}/${dataFinal.getMonth()}/${dataFinal.getFullYear()}`}
                    editable={false}
                    style={{color: "black"}}
                />
            </TouchableOpacity>
            {(datePicker && Platform.OS != "android") &&
                <RNDateTimePicker
                    mode="date"
                    onChange={handleDatePickerChange}
                    value={dataFinal}
                />
            }

            <AutocompleteDropdown
                controller={controller => {
                    dropdownController.current = controller
                }}
                direction={"up"}
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
                loading={loading}
                useFilter={false}
                textInputProps={{
                    placeholder: 'Usuários',
                    autoCorrect: false,
                    autoCapitalize: 'none',
                }}
                inputContainerStyle={{
                    ...styles.inputAutocomplete,
                    backgroundColor: "#fff"
                }}
                suggestionsListContainerStyle={{
                    marginLeft: -20
                }}
                renderItem={(item) => <Text style={{padding: 15 }}>{item.title}</Text>}
                ChevronIconComponent={<Feather name="chevron-down" size={20} color="#000" />}
                ClearIconComponent={<Feather name="x-circle" size={18} color="#000" />}
                inputHeight={50}
                closeOnBlur
                showChevron={false}
                clearOnFocus={false}
                EmptyResultComponent={<></>}
            />

            <FlatList
                data={participantes}
                renderItem={({item}) => 
                    <TouchableOpacity style={styles.chip} onPress={() => removerParticipante(item)}>
                        <Text>{item.title}</Text>
                        <AntDesign name="closecircle" size={15} color="black" style={{marginLeft: 5}}/>
                    </TouchableOpacity>
                }
                contentContainerStyle={{flexDirection: "row"}}
            />

            <Button
                title='Criar'
                onPress={submit}
            />
        </AutocompleteDropdownContextProvider>
        </BaseModal>
    );
}

const styles = StyleSheet.create({
    titleContainer: {
      height: '16%',
      paddingHorizontal: 20,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    title: {
      fontSize: 16,
    },
    input: {
        borderWidth: 1,
        borderColor: "#000",
        padding: 10,
        margin: 10,
        borderRadius: 4,
    },
    inputAutocomplete:{
        borderWidth: 1,
        borderColor: "#000",
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
    }
  });
  