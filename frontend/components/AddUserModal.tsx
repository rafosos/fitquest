import { useSession } from '@/app/ctx';
import UserService from '@/services/user_service';
import { useState } from 'react';
import { View, Text, StyleSheet, Button, TextInput } from 'react-native';
import BaseModal from './base/modal';

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
        <BaseModal
            isVisible={isVisible}
            onClose={clearAndClose}
        >
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Adicionar amigo</Text>
                </View>
                <TextInput
                    placeholder='Nickname'
                    value={nickname}
                    onChangeText={(txt) => setNickname(txt)}
                    style={styles.input}
                />
                <Button 
                    title='Adicionar'
                    onPress={addAmigo}    
                />
        </BaseModal>
    );
}

const styles = StyleSheet.create({
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
    input: {
        borderWidth: 1,
        borderColor: "#000",
        padding: 10,
        margin: 10,
        borderRadius: 4,
    }
  });
  