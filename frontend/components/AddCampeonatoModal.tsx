import React, { useCallback } from "react";
import { useSession } from '@/app/ctx';
import Campeonato from '@/classes/campeonato';
import CampeonatoService from '@/services/campeonato_service';
import UserService from '@/services/user_service';
import { useRef, useState } from 'react';
import { Modal, View, Text, StyleSheet, Button, TextInput, Platform, Dimensions } from 'react-native';
import { AutocompleteDropdown, AutocompleteDropdownRef, TAutocompleteDropdownItem } from 'react-native-autocomplete-dropdown';
import { Feather } from "@expo/vector-icons";
import BaseModal from "./base/modal";

export default function AddCampeonatoModal({ isVisible = false, onClose = () => {} }) {
    const {userId} = useSession();
    const [nome, setNome] = useState("");
    const [duracao, setDuracao] = useState("");
    const [participantes, setParticipantes] = useState<number[]>([Number(userId)]);
    const [loading, setLoading] = useState(false);
    const [amigos, setAmigos] = useState<TAutocompleteDropdownItem[]>([]);

    const userService = UserService();
    const campeonatoService = CampeonatoService();

    const partifipantesRef = useRef(null);
    const dropdownController = useRef<AutocompleteDropdownRef | null>(null)

    const clearAndClose = () =>{
        setNome("");
        onClose();
    }

    const getUsersDropdown = (f: string) => {
        if(!userId) return;

        if (typeof f !== 'string' || f.length < 3) {
            setAmigos([]);
            return;
        }

        setLoading(true);
        userService.getAmigosFilter(userId, f)
            .then(res => setAmigos(res.map(user => {return {id: user.id.toString(), title:user.fullname}}
            )))
            .catch(err => console.log(err))
            .finally(() => setLoading(false));
    }

    const onClearPress = useCallback(() => setAmigos([]), [])

    const submit = () => {
        campeonatoService.addCampeonato(new Campeonato(nome, new Date(duracao), participantes))
            .then(res => clearAndClose())
            .catch(err => console.log(err));
    }

    return (
        <BaseModal 
            isVisible={isVisible}
            onClose={onClose}
        >
            <View style={styles.titleContainer}>
                <Text style={styles.title}>Criar campeonato</Text>
            </View>

            <TextInput
                placeholder='nome'
                value={nome}
                style={styles.input}
                onChangeText={(txt) => setNome(txt)}
            />

            <TextInput
                placeholder='duracao'
                value={duracao}
                style={styles.input}
                onChangeText={(txt) => setDuracao(txt)}
            />

            <AutocompleteDropdown
                ref={partifipantesRef}
                controller={controller => {
                    dropdownController.current = controller
                }}
                direction={Platform.select({ ios: 'down' })}
                dataSet={amigos}
                onChangeText={getUsersDropdown}
                onSelectItem={item => {
                    item && setParticipantes([...participantes, Number(item.id)])
                }}
                debounce={600}
                suggestionsListMaxHeight={Dimensions.get('window').height * 0.4}
                onClear={onClearPress}
                loading={loading}
                useFilter={false} // set false to prevent rerender twice
                textInputProps={{
                    placeholder: 'Usuários',
                    autoCorrect: false,
                    autoCapitalize: 'none',
                    style: styles.input,
                }}
                rightButtonsContainerStyle={{
                    right: 8,
                    height: 30,
                    alignSelf: 'center',
                }}
                inputContainerStyle={{
                    backgroundColor: "#fff"
                }}
                containerStyle={{ flexGrow: 1, flexShrink: 1 }}
                renderItem={(item, text) => <Text style={{ color: '#fff', padding: 15 }}>{item.title}</Text>}
                ChevronIconComponent={<Feather name="chevron-down" size={20} color="#fff" />}
                    ClearIconComponent={<Feather name="x-circle" size={18} color="#fff" />}
                inputHeight={50}
                showChevron={false}
                closeOnBlur={false}
                showClear={false}
            />

            <Button
                title='Criar'
                onPress={submit}
            />
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
    }
  });
  