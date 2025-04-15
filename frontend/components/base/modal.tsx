import { colors } from "@/constants/Colors";
import React from "react";
import { TouchableOpacity, TouchableWithoutFeedback, Modal, View, StyleSheet, ViewStyle } from 'react-native';
import { AutocompleteDropdownContextProvider } from "react-native-autocomplete-dropdown";

interface Props{
    transparent?: boolean
    isVisible: boolean
    onClose: () => void
    styleContainer?: ViewStyle
    children: React.ReactNode
}

export default function BaseModal({ 
    transparent = true,
    isVisible, 
    onClose,
    styleContainer,
    children }: Props) {

    return (
        <Modal 
            animationType="slide" 
            transparent={transparent} 
            visible={isVisible}
            onRequestClose={() => onClose()}
        >
            <AutocompleteDropdownContextProvider>

            <TouchableOpacity
                activeOpacity={1}
                style={styles.modalWrapper}
                onPressOut={onClose}
                >
                <TouchableWithoutFeedback>
                    <View style={[styles.modalContent, styleContainer]} onTouchStart={() => {}}>
                        {children}
                    </View>
                </TouchableWithoutFeedback>
            </TouchableOpacity>
            </AutocompleteDropdownContextProvider>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalWrapper: {
        flex:1,
        backgroundColor: colors.preto.fade[5],
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: "5%",
    },
    modalContent: {
        width: '100%',
        backgroundColor: colors.branco.padrao,
        borderRadius: 18,
        padding: 5
    }
  });
  