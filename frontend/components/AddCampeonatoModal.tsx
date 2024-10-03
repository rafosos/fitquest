import { useSession } from '@/app/ctx';
import Campeonato from '@/classes/campeonato';
import CampeonatoService from '@/services/campeonato_service';
import UserService from '@/services/user_service';
import { useState } from 'react';
import { Modal, View, Text, StyleSheet, Button, TextInput } from 'react-native';

export default function AddCampeonatoModal({ isVisible = false, onClose = () => {} }) {
    const {userId} = useSession();
    const [nome, setNome] = useState("");
    const [duracao, setDuracao] = useState("");
    const [participantes, setParticipantes] = useState<number[]>([Number(userId)]);

    const userService = UserService();
    const campeonatoService = CampeonatoService();

    const clearAndClose = () =>{
        setNome("");
        onClose();
    }

    const submit = () => {
        campeonatoService.addCampeonato(new Campeonato(nome, new Date(duracao), participantes))
            .then(res => clearAndClose())
            .catch(err => console.log(err));
    }

    return (
        <Modal 
            animationType="slide" 
            transparent={true} 
            visible={isVisible}
            onRequestClose={() => onClose()}
        >
            <View style={styles.modalContent}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Criar campeonato</Text>
                </View>

                <TextInput
                    placeholder='nome'
                    value={nome}
                    onChangeText={(txt) => setNome(txt)}
                />

                <TextInput
                    placeholder='duracao'
                    value={duracao}
                    onChangeText={(txt) => setDuracao(txt)}
                />

                <TextInput
                    placeholder='duracao'
                    value={participantes.toString()}
                    onChangeText={(txt) => setParticipantes([Number(userId), ...txt.split(",").map(num => Number(num))])}
                />

                <Button
                    title='Criar'
                    onPress={submit}
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
  