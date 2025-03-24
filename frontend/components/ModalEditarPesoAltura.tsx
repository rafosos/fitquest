import UserService from "@/services/user_service";
import BaseModal from "./base/modal";
import StyledTextInput from "./base/styledTextInput";
import { useEffect, useState } from "react";
import StyledText from "./base/styledText";
import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from "react-native";
import { useSession } from "@/app/ctx";
import { colors } from "@/constants/Colors";
import { fonts } from "@/constants/Fonts";
import ErroInput from "./ErroInput";
import { errorHandlerDebug } from "@/services/service_config";

export enum TipoModalPesoAltura{
    peso, altura
}

interface Props{
    visible: boolean
    onClose: () => void,
    tipo: TipoModalPesoAltura,
    valorOriginal: number
}

export function ModalEditarPesoAltura({visible, onClose, tipo, valorOriginal}: Props){
    const [valor, setValor] = useState(`${valorOriginal}`);
    const [loading, setLoading] = useState(false);
    const [erros, setErros] = useState<any>({});
    const {id:userId} = JSON.parse(useSession().username ?? "{id:null}");
    const userService = UserService();

    useEffect(() => {
        valorOriginal && setValor(valorOriginal.toString())
    }, [valorOriginal]);

    const close = () => {
        setValor(valorOriginal.toString());
        onClose();
    }

    const submit = () => {
        if (!valor || valor === valorOriginal.toString()) 
            return close();

        setLoading(true);
        if (tipo == TipoModalPesoAltura.peso)
            userService.editarPeso(userId, Number(valor))
                .then(() => close())
                .catch(err => {
                    errorHandlerDebug(err)
                    if (err.response){
                        setErros({geral: err.response.data.detail})}
                    else
                        setErros({geral: err.message})})
                .finally(() => setLoading(false));
        else
            userService.editarAltura(userId, Number(valor))
                .then(() => close())
                .catch(err => {
                    errorHandlerDebug(err)
                    if (err.response){
                        setErros({geral: err.response.data.detail})}
                    else
                        setErros(err.message)})
                .finally(() => setLoading(false));
    }

    return (
        <BaseModal
            onClose={onClose}
            isVisible={visible}
        >
            <View style={styles.container}>
                <ErroInput 
                    show={erros.geral}
                    texto={erros.geral}
                />

                <StyledText style={styles.titulo}>Editar {TipoModalPesoAltura[tipo]}</StyledText>
                <StyledTextInput
                    style={styles.input}
                    value={valor}
                    keyboardType="decimal-pad"
                    onChangeText={(txt) => setValor(txt)}
                    textAlign="center"
                />

                <TouchableOpacity onPress={submit} style={[styles.botao, styles.botaoSalvar]}>
                    {loading ? <ActivityIndicator size={"small"} color={colors.verde.padrao}/> 
                    : <StyledText style={styles.txtBotao}>SALVAR</StyledText> }
                </TouchableOpacity>

                <TouchableOpacity onPress={close} style={[styles.botao]}>
                    <StyledText>CANCELAR</StyledText> 
                </TouchableOpacity>
            </View>
        </BaseModal>
)};

const styles = StyleSheet.create({
    container:{
        margin:5
    },
    titulo:{
        fontFamily: fonts.padrao.SemiBold600,
        fontSize: 20,
    },
    input:{
        borderWidth: 1,
        borderRadius: 15,
        borderColor: colors.preto.padrao,
        padding:5,
        paddingHorizontal:15,
        marginVertical:10
    },
    botao:{
        alignItems: 'center',
        padding: 5,
        borderRadius: 15,
    },
    botaoSalvar:{
        backgroundColor: colors.cinza.escuro,
        marginVertical: 5
    },
    txtBotao:{
        color: colors.branco.padrao
    }
})