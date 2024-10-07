import React from "react";
import { TouchableOpacity, TouchableWithoutFeedback, Modal, View, StyleSheet } from 'react-native';

export default function BaseModal({ isVisible = false, onClose = () => {}, ...props }) {

    return (
        <Modal 
            animationType="slide" 
            transparent={true} 
            visible={isVisible}
            onRequestClose={() => onClose()}
        >
            <TouchableOpacity
                activeOpacity={1}
                style={styles.modalWrapper}
                onPressOut={onClose}
            >
                <TouchableWithoutFeedback>
                    <View style={styles.modalContent} onTouchStart={() => {}}>
                        {props.children}
                    </View>
                </TouchableWithoutFeedback>
            </TouchableOpacity>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalWrapper: {
        flex:1,
        backgroundColor: "rgba(0,0,0,0.5)",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: "5%",
    },
    modalContent: {
      width: '100%',
      backgroundColor: '#fff',
      borderRadius: 18,
      padding: 5
    }
  });
  