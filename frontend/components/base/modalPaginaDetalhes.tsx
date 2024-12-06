import { Modal, StyleSheet, View } from "react-native";
import ModalConfirmacao, { PropsModalConfirmacao } from "../ModalConfirmacao";
import { colors } from "@/constants/Colors";
import { ReactNode } from "react";

interface ModalPaginaProps{
    visible: boolean,
    close: () => void,
    modalConfirmacaoProps: PropsModalConfirmacao,
    children: ReactNode,
}

export default function ModalPaginaDetalhes(props:ModalPaginaProps){    
    return (
        <Modal
            animationType="slide" 
            transparent={false}
            visible={props.visible}
            onRequestClose={() => props.close()}
        >
            <ModalConfirmacao {...props.modalConfirmacaoProps} />

            <View style={styles.modalContent}>
                {props.children}
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modalContent: {
        backgroundColor: colors.cinza.background,
        padding: 5,
        flex:1,
    },
})