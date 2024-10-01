import UserService from '@/services/user_service';
import { useState } from 'react';
import { Modal, View, Text, StyleSheet, Button, TextInput } from 'react-native';

export default function AddUserModal({ isVisible = false, onClose = () => {} }) {
    const [nickname, setNickname] = useState("");

    const userService = UserService();

    const addAmigo = () =>
        userService.addAmigo(nickname)
            .then(res => onClose())
            .catch(err => console.log(err));

    return (
        <Modal animationType="slide" transparent={true} visible={isVisible}>
        <View style={styles.modalContent}>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>Adicionar amigo</Text>
            </View>
            <TextInput
                placeholder='Nickname'
                value={nickname}
                onChangeText={(txt) => setNickname(txt)}
            />
            <Button 
                title='Adicionar'
                onPress={addAmigo}    
            />
        </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalContent: {
      height: '25%',
      width: '100%',
      backgroundColor: '#25292e',
      borderTopRightRadius: 18,
      borderTopLeftRadius: 18,
      position: 'absolute',
      bottom: 0,
    },
    titleContainer: {
      height: '16%',
      backgroundColor: '#464C55',
      borderTopRightRadius: 10,
      borderTopLeftRadius: 10,
      paddingHorizontal: 20,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    title: {
      color: '#fff',
      fontSize: 16,
    },
  });
  