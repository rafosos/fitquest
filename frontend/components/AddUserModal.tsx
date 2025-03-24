import UserService from '@/services/user_service';
import { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import BaseModal from './base/modal';
import { colors } from '@/constants/Colors';
import { AutocompleteDropdown, AutocompleteDropdownItem } from 'react-native-autocomplete-dropdown';
import { Feather } from '@expo/vector-icons';
import { errorHandlerDebug } from '@/services/service_config';
import ErroInput from './ErroInput';
import StyledText from './base/styledText';
import { UserNaoAmigoDropbox } from '@/classes/user';
import { fonts } from '@/constants/Fonts';

export default function AddUserModal({ isVisible = false, onClose = () => {} }) {
    const [loading, setLoading] = useState(false);
    const [amigoId, setAmigoId] = useState<number | null>(null);
    const [resultados, setResultados] = useState<UserNaoAmigoDropbox[]>([]);
    const [erro, setErro] = useState<string>("");

    const userService = UserService();
    
    const clearAndClose = () =>{
        setAmigoId(null);
        onClose();
    }
    
    const getUsersDropdown = (f: string) => {
        setLoading(true);
        userService.getNaoAmigos(f)
            .then(res => setResultados(res))
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
        amigoId &&
        userService.addAmigo(amigoId)
            .then(res => clearAndClose())
            .catch(err => {
                errorHandlerDebug(err);
                if (err.response)
                    setErro(err.response.data.detail);
                else
                    setErro(err.message);
            });

    return (
        <BaseModal
            isVisible={isVisible}
            onClose={clearAndClose}
        >
            <View style={styles.titleContainer}>
                <Text style={styles.title}>Adicionar amigo</Text>
            </View>

            <ErroInput
                show={!!erro}
                texto={erro}
            />

            <AutocompleteDropdown
                dataSet={resultados.map(user => {return {id: user.id.toString(), title:user.fullname}})}
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
                renderItem={(item) =>{
                    const user = resultados.find(u => u.id == Number(item.id));
                    return(
                        <View style={styles.containerDropdownItem}>
                            <StyledText style={styles.dropdownItemUsername}>{user?.username}</StyledText>
                            <StyledText style={styles.dropdownItemFullname}>{user?.fullname}</StyledText>
                        </View>
                    )}}
                clearOnFocus={false}
                closeOnSubmit
                EmptyResultComponent={<></>}
            />
            <TouchableOpacity disabled={!amigoId} onPress={addAmigo} style={[styles.botaoAdicionar, !amigoId && {backgroundColor: colors.cinza.medio} ]}>
                <Text style={styles.txtBotaoAdicionar}>Adicionar</Text>
            </TouchableOpacity>    
        </BaseModal>
    );
}

const styles = StyleSheet.create({
    titleContainer: {
        marginTop: 5,
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    title: {
        fontSize: 20,
        fontWeight: '800'
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
        margin: 10,
        borderRadius: 4,
    },
    containerDropdownItem:{
        flexDirection: 'column',
        padding: 12
    },
    dropdownItemUsername:{
        fontFamily: fonts.padrao.Bold700
    },
    dropdownItemFullname: {
        fontFamily: fonts.padrao.Light300,
        fontSize: 13
    },
    botaoAdicionar: {
        padding: 8,
        borderRadius:15,
        marginHorizontal:15,
        backgroundColor: colors.verde.padrao,
        marginBottom: 5
    },
    txtBotaoAdicionar: {
        textAlign: 'center',
        fontSize: 20,
        color: colors.branco.padrao,
    }
});
  