import React, { useEffect, useState } from 'react';
import { Button, FlatList, Text } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useSession } from '@/app/ctx';
import User from '@/classes/user';
import AddUserModal from '@/components/AddUserModal';
import UserService from '@/services/user_service';

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
        <Text>i'll be there for you sz</Text>
        <AddUserModal
            isVisible={addModal}
            onClose={onCloseModal}
        />

        <FlatList
            data={amigos}
            renderItem={({item:amigo}) => <> 
                <Text>{amigo.fullname}</Text>
            </>}
            ListEmptyComponent={<>
            <Text>Parece que ainda não tem ninguém aqui... Adicione alguém agora! :) </Text>
            <AntDesign onPress={abrirModal}
            name="adduser" size={24} color="black" />
            </>}
        />

        <FlatList
            data={pedidosAmizade}
            ListHeaderComponent={<>
            <Text>Pedidos de amizade</Text>
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

        <Button 
            title='add amigo'
            onPress={abrirModal}
        />
        </>
    );
}
 