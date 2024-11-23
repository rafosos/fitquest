import React, { useRef } from 'react';
import { Link } from "expo-router";
import { StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import User from '@/classes/user';
import { useSession } from '@/app/ctx';
import { colors } from '@/constants/Colors';
import { AntDesign } from '@expo/vector-icons';
import StyledText from '@/components/base/styledText';
import { fonts } from '@/constants/Fonts';
import { showDiaMes } from '@/utils/functions';

export default function Configuracoes() {
    const { signOut, user: userString } = useSession();
    const user:User = useRef(JSON.parse(userString ?? "{}")).current;

    const onPressLogOut = () => {
        signOut();
    }

    const campoConfiguracao = (stylePosicao: StyleProp<ViewStyle>, tituloItem: string, valorItem: string) => 
        <View style={[s.containerConfiguracao, stylePosicao]}>
            <StyledText style={s.txtInfo}>{tituloItem}</StyledText> 
            <StyledText style={s.valorCard}>{valorItem}</StyledText>
        </View>

  
    return (
        <View style={s.container}>
            <View style={s.header}>
                <Link href="../">
                    <AntDesign name="arrowleft" size={24} color={colors.branco.padrao} />
                </Link>
                <StyledText style={s.txtHeader}>Configurações</StyledText>
            </View>
        
            <StyledText style={s.tituloCard}>Dados pessoais</StyledText>

            <View style={s.containerInfo}>
                {campoConfiguracao(s.textTop, "Nome completo", user.fullname)}
                {campoConfiguracao(s.textMiddle, "Data de nascimento", showDiaMes(user.nascimento))}
                {campoConfiguracao(s.textBottom, "Email", user.email)}
            </View>

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
    containerConfiguracao:{
        flexDirection: 'column',
        borderWidth: 2, 
        borderColor: colors.cinza.escuro,
        padding:10,
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
        borderTopWidth: 0, 
        borderBottomWidth: 0
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