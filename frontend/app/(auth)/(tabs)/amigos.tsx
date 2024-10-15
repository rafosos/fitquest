import React, { useEffect, useState } from 'react';
import { Button, FlatList, StyleSheet, Text, View } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useSession } from '@/app/ctx';
import User from '@/classes/user';
import AddUserModal from '@/components/AddUserModal';
import UserService from '@/services/user_service';
import ActionButton from '@/components/ActionButton';
import { colors } from '@/constants/Colors';

export default function TabAmigos() {
    const [addModal, setAddModal] = useState(false);
    const [amigos, setAmigos] = useState<User[]>([]);
    const [pedidosAmizade, setPedidosAmizade] = useState<User[]>([]);
    const { id: userId } = JSON.parse(useSession().user ?? "{id: null}");

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
            contentContainerStyle={styles.containerAmigos}
            ListHeaderComponent={<>
                <Text style={styles.titulo}>Amigos</Text>
            </>}
            renderItem={({item:amigo}) => 
                <View style={styles.cardAmigo}> 
                    <Text style={styles.nickname}>{amigo.nickname}</Text>
                    <Text style={styles.fullname}>{amigo.fullname}</Text>
                </View>
            }
            ListEmptyComponent={
                <View style={styles.containerSemAmigos}>
                    <Text style={styles.textoSemAmigos}>Parece que ainda não tem ninguém aqui... Adicione alguém agora! :) </Text>
                    <AntDesign onPress={abrirModal} name="adduser" size={50} color="black" />
                </View>
            }
        />

        <FlatList
            data={pedidosAmizade}
            contentContainerStyle={styles.containerAmigos}
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
    containerAmigos:{
        flex:1,
        padding:14
    },
    titulo:{
        fontSize: 25,
        fontWeight: "800"
    },
    cardAmigo:{
        backgroundColor: colors.cinza.medio,
        borderColor: colors.cinza.escuro,
        borderWidth: 2,
        borderRadius: 25,
        padding: 10,
        marginVertical: 2
    },
    nickname:{
        fontSize: 17,
        fontWeight: "700"
    },
    fullname:{
    },
    containerSemAmigos:{
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    textoSemAmigos:{
        fontSize: 18
    },
})