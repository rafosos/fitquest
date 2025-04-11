import React, { ReactNode } from "react";
import { View, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import BaseModal from "./base/modal";
import { AntDesign } from "@expo/vector-icons";
import { colors } from "@/constants/Colors";
import StyledText from "./base/styledText";
import { fonts } from "@/constants/Fonts";

export interface PropsModalConfirmacao{
    show: boolean;
    onClose: () => void;
    onConfirma: () => void;
    titulo: string;
    subtitulo?: string;
    botaoConfirmar?: ReactNode;
    loading?: boolean;
}

export default function ModalConfirmacao({
    show,
    onClose,
    onConfirma,
    titulo,
    subtitulo,
    botaoConfirmar,
    loading
}: PropsModalConfirmacao) {

    return (
        <BaseModal 
            isVisible={show}
            onClose={loading ? () => null : onClose}
        >
            <View style={styles.container}>
                <View style={styles.containerTitulo}>
                    <StyledText style={styles.titulo}>{titulo}</StyledText>
                </View>

                {subtitulo && 
                    <View style={styles.containerSubtitulo}>
                        <StyledText style={styles.subtitulo}>{subtitulo}</StyledText>
                    </View>
                }

                <View style={styles.containerBotoes}>
                    <TouchableOpacity style={{...styles.botao, ...styles.botaoCancelar}} onPress={loading ? () => null : onClose}>
                        {!loading ? <>
                            <AntDesign name="close" style={styles.icone} />
                            <StyledText style={styles.txtBotao}>CANCELAR</StyledText>
                            </>:
                            <ActivityIndicator color={colors.cinza.escuro} size={"small"}/>
                        }
                    </TouchableOpacity>

                    {botaoConfirmar ?? 
                        <TouchableOpacity style={{...styles.botao, ...styles.botaoConfirmar}} onPress={onConfirma}>
                            <AntDesign name="check" style={styles.icone} />
                            <StyledText style={styles.txtBotao}>CONFIRMAR</StyledText>
                        </TouchableOpacity>
                    }
                </View>
            </View>
        </BaseModal>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 5
    },
    containerTitulo:{

    },
    titulo:{
        fontSize: 20,
        fontFamily: fonts.padrao.Bold700,
        textAlign: "center"
    },
    containerSubtitulo:{
        marginVertical:15
    },
    subtitulo:{
        textAlign: "center"
    },
    containerBotoes:{
        flexDirection: "row",
        justifyContent: 'center',
    },
    botao:{
        flexDirection: 'row',
        borderRadius: 15,
        justifyContent: 'center',
        padding:5,
        paddingHorizontal: 20,
        marginHorizontal:20
    },
    botaoCancelar:{
        backgroundColor: colors.cinza.medio,
    },
    icone:{
        marginRight: 5,
        textAlignVertical: 'center'
    },
    txtBotao:{},
    botaoConfirmar:{}
});
  