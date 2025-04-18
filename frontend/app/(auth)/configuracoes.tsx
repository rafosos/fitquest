import React, { useEffect, useRef, useState } from 'react';
import { Link, router } from "expo-router";
import { ActivityIndicator, KeyboardTypeOptions, StyleProp, StyleSheet, TextInput, TouchableOpacity, View, ViewStyle } from 'react-native';
import { useSession } from '@/app/ctx';
import { colors } from '@/constants/Colors';
import { AntDesign, Entypo, Feather, MaterialIcons } from '@expo/vector-icons';
import StyledText from '@/components/base/styledText';
import { fonts } from '@/constants/Fonts';
import { showDiaMes } from '@/utils/functions';
import StyledTextInput from '@/components/base/styledTextInput';
import UserService from '@/services/user_service';
import { errorHandlerDebug } from '@/services/service_config';
import ErroInput from '@/components/ErroInput';
import User from '@/classes/user';

enum campos {
    fullname,
    nascimento,
    peso,
    altura,
    email,
    status
}

export default function Configuracoes() {
    const { signOut, setUser } = useSession();
    const [campoEditar, setCampoEditar] = useState<campos>();
    const [loading, setLoading] = useState<boolean>(false);
    const [valorEditar, setValorEditar] = useState<any>();
    const [erro, setErro] = useState<string>("");
    const [userRef, setUserRef] = useState<User>();
    const userService = UserService();

    const inputRef = useRef<TextInput>(null);

    useEffect(() => getUserInfo(), []);

    const getUserInfo = () => {
        setLoading(true);
        userService.getUserInfo()
            .then(res => {
                setUserRef(res)})
            .catch(err => errorHandlerDebug(err))
            .finally(() => setLoading(false));
    }

    const onPressLogOut = () => {
        signOut();
    }

    const updateValor = (campo: campos) => {
        let valorNovo = valorEditar;
        if (campo == campos.altura || campo == campos.peso)
            valorNovo = valorNovo.replace(',', '.');

        // if(campo == campos.nascimento)
        //     valorNovo = new Date(valorEditar);
        
        setLoading(true);
        userService.editarDado(campos[campo], valorNovo)
            .then(res => {
                setUserRef(res);
                setUser(JSON.stringify(res));
                setCampoEditar(undefined);
                setErro("");
            })
            .catch(err => {
                errorHandlerDebug(err);
                if (err.response){
                    setErro(err.response.data.detail)}
                else
                    setErro(err.message);
            })
            .finally(() => setLoading(false));
    }

    const habilitarEdicao = (valor: string, campo: campos) => {
        setCampoEditar(campo);
        setValorEditar(valor);
    }

    const cancelar = () => {
        setCampoEditar(undefined);
        setValorEditar('');
    }

    const campoConfiguracao = (
        stylePosicao: StyleProp<ViewStyle>, 
        tituloItem: string, 
        valorItem: any,
        campo: campos,
        inputType: KeyboardTypeOptions = "default",
        extraStyle?: StyleProp<ViewStyle>,
        editable = true
    ) => 
        <View style={[s.containerConfiguracao, stylePosicao]}>
            {campoEditar == campo ?
            <>
                <View style={{flexDirection: 'column', flex:1}}>
                    <StyledText style={s.txtInfo}>{tituloItem}</StyledText> 
                    <StyledTextInput
                        keyboardType={inputType}
                        value={valorEditar}
                        style={{width: '100%'}}
                        ref={inputRef}
                        onChangeText={(txt) => setValorEditar(txt)}
                    />
                </View>
                    {!loading ? 
                        <View style={{flexDirection: 'row'}}>
                            <AntDesign name="close" size={24} onPress={() => cancelar()} style={{marginRight:10}}/>
                            <Feather name="save" size={24} onPress={() => updateValor(campo)} />
                        </View>
                        :<ActivityIndicator size={'small'} color={colors.verde.padrao}/>}
                </>
            :
            <>
                <View style={[extraStyle]}>
                    <StyledText style={s.txtInfo}>{tituloItem}</StyledText> 
                    <StyledText style={s.valorCard}>{typeof(valorItem) == "number" ? valorItem.toString() : valorItem}</StyledText>
                </View>
                {campo != campos.nascimento && <MaterialIcons name="edit" size={18} onPress={() => habilitarEdicao(valorItem, campo)}/>}
            </>
            }
        </View>

  
    return (
        <View style={s.container}>
            <View style={s.header}>
                <Link href="../">
                    <AntDesign name="arrowleft" size={24} color={colors.branco.padrao} />
                </Link>
                <StyledText style={s.txtHeader}>Configurações</StyledText>
            </View>

            <ErroInput 
                show={!!erro}
                texto={erro}
                setShow={setErro}
            />
        
            <StyledText style={s.tituloCard}>Dados pessoais</StyledText>
            <View style={s.containerInfo}>
                {campoConfiguracao(s.textTop, "Nome completo", userRef?.fullname, campos.fullname)}
                {campoConfiguracao(s.textMiddle, "Data de nascimento", showDiaMes(userRef?.nascimento), campos.nascimento)}
                {campoConfiguracao(s.textMiddle, "Peso", userRef?.peso, campos.peso, 'decimal-pad')}
                {campoConfiguracao(s.textMiddle, "Altura", userRef?.altura, campos.altura, 'decimal-pad')}
                {campoConfiguracao(s.textMiddle, "Email", userRef?.email, campos.email)}
                {campoConfiguracao(s.textBottom, "Status", userRef?.status, campos.status)}
            </View>

            <StyledText style={s.tituloCard}>Atividades</StyledText>
            <TouchableOpacity style={s.containerInfo} onPress={() => router.navigate('/(auth)/lixeira')}>
                <View style={[s.containerConfiguracao, s.textTop, s.textBottom]}>
                    <StyledText style={s.txtInfo}>Lixeira</StyledText>
                    <Entypo name="chevron-small-right" size={24} color={colors.cinza.escuro}/>
                </View>
            </TouchableOpacity>

            <TouchableOpacity style={s.containerBotao} onPress={onPressLogOut}>
                <StyledText style={s.textoBotao}>SAIR</StyledText>
            </TouchableOpacity>
      </View>
    );
}

const s = StyleSheet.create({
    container:{
        padding: 10
    },
    header:{
        flexDirection: 'row',
        alignItems: "center",
        marginBottom: 10
    },
    txtHeader:{
        color: colors.branco.padrao,
        fontSize: 22,
        fontFamily: fonts.padrao.Bold700,
        marginLeft: 5,
        textAlignVertical: 'center'
    },
    tituloCard:{
        color:colors.branco.padrao,
        fontSize: 19,
        fontFamily: fonts.padrao.Bold700,
        paddingLeft: 5
    },
    containerInfo:{
        backgroundColor: colors.branco.padrao, 
        borderRadius: 10
    },
    verticalBorder:{
        borderTopWidth: 2,
        borderBottomWidth: 2
    },
    containerConfiguracao:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderWidth: 2, 
        borderColor: colors.cinza.escuro,
        padding:10,
        alignItems: 'center'
    },
    txtInfo:{
        fontFamily: fonts.padrao.SemiBold600,
        fontSize: 14,
    },
    textTop:{
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    textMiddle:{
    },
    textBottom:{
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
    },
    valorCard:{
        fontSize: 15,
        fontFamily: fonts.padrao.Regular400
    },
    containerBotao:{
        backgroundColor: colors.vermelho.padrao,
        justifyContent: "center",
        borderRadius: 20,
        padding: 10,
        paddingHorizontal: 25,
        marginVertical: 10,
        alignSelf: "flex-end"
    },
    textoBotao:{
        textAlign: 'center',
        color: colors.branco.padrao
    }
});