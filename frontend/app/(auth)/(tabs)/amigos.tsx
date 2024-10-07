import React, { useEffect, useState } from 'react';
import { Button, FlatList, StyleSheet, Text, View } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useSession } from '@/app/ctx';
import User from '@/classes/user';
import AddUserModal from '@/components/AddUserModal';
import UserService from '@/services/user_service';
import ActionButton from '@/components/ActionButton';

export default function TabAmigos() {
    const [addModal, setAddModal] = useState(false);
    const [amigos, setAmigos] = useState<User[]>([]);
    const [pedidosAmizade, setPedidosAmizade] = useState<User[]>([]);
    const {userId} = useSession();

    const userService = UserService();

    useEffect(() => 
    refreshFriendList(), []);

    const refreshFriendList = () => {
        if(!userId) return;
            userService.getPedidosAmizade(userId)
                .then(res => setPedidosAmizade(res))
                .catch(err => console.log(err));

            userService.getAmigos(userId)
                .then(res => setAmigos(res))
                .catch(err => console.log(err));
    }
    
    const onCloseModal = () => {
        setAddModal(false);
        refreshFriendList();
        // show smth for user, some feedback
    }

    const aceitarAmizade = (id: number) =>
        userId && userService.aceitarAmizade(userId, id)
            .then(res => refreshFriendList())
            .catch(err => console.log(err));

    const abrirModal = () => setAddModal(true);

    return (<>
        <AddUserModal
            isVisible={addModal}
            onClose={onCloseModal}
        />

        <FlatList
            data={amigos}
            contentContainerStyle={{flex:1}}
            ListHeaderComponent={<>
                <Text style={styles.titulo}>Amigos</Text>
            </>}
            renderItem={({item:amigo}) => <> 
                <Text>{amigo.fullname}</Text>
            </>}
            ListEmptyComponent={
                <View style={styles.containerSemAmigos}>
                    <Text style={styles.textoSemAmigos}>Parece que ainda não tem ninguém aqui... Adicione alguém agora! :) </Text>
                    <AntDesign onPress={abrirModal} name="adduser" size={50} color="black" />
                </View>
            }
        />

        <FlatList
            data={pedidosAmizade}
            ListHeaderComponent={<>
                <Text style={styles.titulo}>Pedidos de amizade</Text>
            </>}
            renderItem={({item:pedido}) => <> 
                <Text>{pedido.fullname}</Text>
                <Button 
                    title="Aceitar"
                    onPress={() => aceitarAmizade(pedido.id)}
                />
            </>}
            ListEmptyComponent={<>
            <Text>Você não tem pedidos pendentes.</Text>
            </>}
        />
        <ActionButton acao={abrirModal}/>
        </>

    );
}

const styles = StyleSheet.create({
    containerSemAmigos:{
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    textoSemAmigos:{
        fontSize: 18
    },
    titulo:{
        fontSize: 18
    }
})