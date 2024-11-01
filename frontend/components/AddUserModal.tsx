import { useSession } from '@/app/ctx';
import UserService from '@/services/user_service';
import { useRef, useState } from 'react';
import { View, Text, StyleSheet, Button, Dimensions } from 'react-native';
import BaseModal from './base/modal';
import { colors } from '@/constants/Colors';
import { AutocompleteDropdown, AutocompleteDropdownItem, IAutocompleteDropdownRef } from 'react-native-autocomplete-dropdown';
import { Feather } from '@expo/vector-icons';
import { errorHandlerDebug } from '@/services/service_config';

export default function AddUserModal({ isVisible = false, onClose = () => {} }) {
    const [loading, setLoading] = useState(false);
    const [amigoId, setAmigoId] = useState<number | null>(null);
    const [resultados, setResultados] = useState<AutocompleteDropdownItem[]>([]);
    const { id: userId } = JSON.parse(useSession().user ?? "{id: null}");

    const userService = UserService();
    
    const clearAndClose = () =>{
        setAmigoId(null);
        onClose();
    }
    
    const getUsersDropdown = (f: string) => {
        if(!userId) return;

        setLoading(true);
        userService.getNaoAmigos(userId, f)
            .then(res => setResultados(res.map(user => {return {id: user.id.toString(), title:user.fullname}})))
            .catch(err => errorHandlerDebug(err))
            .finally(() => setLoading(false));
    }

    const onSelectItem = (item: AutocompleteDropdownItem | null) => {
        if(!item) return
        const e = resultados.find((r) => r.id.toString() == item.id);
        if(!e) return;

        setAmigoId(Number(e.id));
    }

    const addAmigo = () => 
        userId && amigoId &&
        userService.addAmigo(userId, amigoId)
            .then(res => clearAndClose())
            .catch(err => console.log(err));

    return (
        <BaseModal
            isVisible={isVisible}
            onClose={clearAndClose}
        >
            <View style={styles.titleContainer}>
                <Text style={styles.title}>Adicionar amigo</Text>
            </View>
            <AutocompleteDropdown
                dataSet={resultados}
                onChangeText={getUsersDropdown}
                onSelectItem={onSelectItem}
                debounce={600}
                suggestionsListMaxHeight={Dimensions.get('window').height * 0.4}
                loading={loading}
                useFilter={false}
                suggestionsListContainerStyle={{
                    backgroundColor: colors.branco.padrao
                }}
                suggestionsListTextStyle={{
                    color: colors.preto.padrao
                }}
                textInputProps={{
                    placeholder: 'Pesquisar usuário',
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
            <Button 
                title='Adicionar'
                onPress={addAmigo}    
            />
        </BaseModal>
    );
}

const styles = StyleSheet.create({
    titleContainer: {
      borderTopRightRadius: 10,
      borderTopLeftRadius: 10,
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
        borderColor: colors.preto.padrao,
        padding: 10,
        margin: 10,
        borderRadius: 4,
    },
    inputAutocomplete:{
        borderWidth: 1,
        borderColor: colors.preto.padrao,
        // padding: 10,
        margin: 10,
        borderRadius: 4,
    },
  });
  