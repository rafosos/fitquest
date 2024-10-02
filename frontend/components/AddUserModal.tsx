import { useSession } from '@/app/ctx';
import UserService from '@/services/user_service';
import { useState } from 'react';
import { Modal, View, Text, StyleSheet, Button, TextInput } from 'react-native';

export default function AddUserModal({ isVisible = false, onClose = () => {} }) {
    const [nickname, setNickname] = useState("");
    const {userId} = useSession();

    const userService = UserService();

    const clearAndClose = () =>{
        setNickname("");
        onClose();
    }

    const addAmigo = () => 
        userId &&
        userService.addAmigo(userId, nickname)
            .then(res => clearAndClose())
            .catch(err => console.log(err));

    return (
        <Modal 
            animationType="slide" 
            transparent={true} 
            visible={isVisible}
            onRequestClose={() => onClose()}
        >
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
      backgroundColor: '#fff',
      borderTopRightRadius: 18,
      borderTopLeftRadius: 18,
      position: 'absolute',
      bottom: 0,
    },
    titleContainer: {
      height: '16%',
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
  });
  