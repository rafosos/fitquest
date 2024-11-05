import React, { useEffect, useState } from 'react';
import { Button, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useSession } from '@/app/ctx';
import User from '@/classes/user';
import AddUserModal from '@/components/AddUserModal';
import UserService from '@/services/user_service';
import ActionButton from '@/components/ActionButton';
import { colors } from '@/constants/Colors';
import ModalConfirmacao from '@/components/ModalConfirmacao';
import { Feather } from '@expo/vector-icons';
import { errorHandlerDebug } from '@/services/service_config';

export default function TabAmigos() {
    const [addModal, setAddModal] = useState(false);
    const [amigos, setAmigos] = useState<User[]>([]);
    const [modalConfirma, setModalConfirma] = useState<{show:boolean, user: User | null}>({show: false, user: null});
    const [pedidosAmizade, setPedidosAmizade] = useState<User[]>([]);
    const [loadingRequests, setLoadingRequests] = useState(false);
    const [loadingAmigos, setLoadingAmigos] = useState(false);
    const { id: userId } = JSON.parse(useSession().user ?? "{id: null}");

    const userService = UserService();

    useEffect(() => 
    refreshFriendList(), []);

    const refreshFriendList = () => {
        if(!userId) return;

        refreshAmigos();
        refreshRequests();
    }
        
    const refreshAmigos = () => {
        setLoadingAmigos(true);
        userService.getAmigos(userId)
            .then(res => setAmigos(res))
            .catch(err => console.log(err))
            .finally(() => setLoadingAmigos(false));          
    }
    
    const refreshRequests = () => {
        setLoadingRequests(true);
        userService.getPedidosAmizade(userId)
            .then(res => setPedidosAmizade(res))
            .catch(err => console.log(err))
            .finally(() => setLoadingRequests(false))
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
    
    const recusarAmizade = (id: number) => 
        userId && userService.recusarAmizade(userId, id)
                .then(res => refreshFriendList())
                .catch(err => console.log(err));

    const abrirModal = () => setAddModal(true);

    const deletarAmizade = () => {
        if(!modalConfirma.user?.id) return;

        userService.deletarAmizade(userId, modalConfirma.user.id)
            .then(res => {
                setModalConfirma({show:false, user:null});
                refreshFriendList();
            })
            .catch(err => errorHandlerDebug(err));
    }

    return (<View style={styles.container}>
        <AddUserModal
            isVisible={addModal}
            onClose={onCloseModal}
        />

        <ModalConfirmacao
            show={modalConfirma.show}
            onClose={() => setModalConfirma({show: false, user: null})}
            onConfirma={deletarAmizade}
            titulo={`Deseja realmente desfazer a amizade com ${modalConfirma.user?.nickname}?`}
            botaoConfirmar={
            <TouchableOpacity onPress={deletarAmizade} style={styles.botaoConfirmaDeletar}>
                <Feather name="trash-2" size={18} color={colors.branco.padrao}/>
                <Text style={styles.txtConfirmaDeletar}>DESFAZER</Text>
            </TouchableOpacity>}
        />

        <FlatList
            data={amigos}
            contentContainerStyle={styles.containerAmigos}
            refreshControl={<RefreshControl refreshing={loadingAmigos} onRefresh={refreshAmigos}/>}
            ListHeaderComponent={<>
                <Text style={styles.titulo}>Amigos</Text>
            </>}
            renderItem={({item:amigo}) => 
                <View style={styles.cardAmigo}>
                    <View>
                        <Text style={styles.nickname}>{amigo.nickname}</Text>
                        <Text style={styles.fullname}>{amigo.fullname}</Text>
                    </View>
                    <Feather name="trash-2" size={24} color={colors.vermelho.padrao} onPress={() => setModalConfirma({show:true, user: amigo})}/>
                </View>
            }
            ListEmptyComponent={
                <View style={styles.containerSemAmigos}>
                    <Text style={styles.textoSemAmigos}>Parece que ainda não tem ninguém aqui... Adicione alguém agora!</Text>
                    <AntDesign onPress={abrirModal} name="adduser" size={50} color={colors.branco.padrao} />
                </View>
            }
        />

        <FlatList
            data={pedidosAmizade}
            refreshControl={<RefreshControl refreshing={loadingRequests} onRefresh={refreshRequests}/>}
            contentContainerStyle={styles.containerAmigos}
            ListHeaderComponent={<>
                <Text style={styles.titulo}>Pedidos de amizade</Text>
            </>}
            renderItem={({item:pedido}) => 
                <View style={styles.cardAmigo}>
                    <View>
                        <Text style={styles.nickname}>{pedido.nickname}</Text>
                        <Text style={styles.fullname}>{pedido.fullname}</Text>
                    </View>

                    <View style={{flexDirection: 'row'}}>
                        <TouchableOpacity onPress={() => recusarAmizade(pedido.id)} style={[styles.botaoPedido, styles.botaoRecusar]}>
                            <Text style={styles.txtBotao}>RECUSAR</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => aceitarAmizade(pedido.id)} style={[styles.botaoPedido, styles.botaoAceitar]}>
                            <Text style={styles.txtBotao}>ACEITAR</Text>  
                        </TouchableOpacity>
                    </View>
                </View>
            }
            ListEmptyComponent={<>
            <Text style={styles.textoSemPedidos}>Você não tem pedidos pendentes.</Text>
            </>}
        />

        <ActionButton acao={abrirModal}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        backgroundColor: colors.cinza.background,
        flex:1
    },
    containerAmigos:{
        flex:1,
        padding:14
    },
    titulo:{
        fontSize: 25,
        fontWeight: "800",
        color: colors.branco.padrao
    },
    cardAmigo:{
        backgroundColor: colors.cinza.medio,
        borderColor: colors.cinza.escuro,
        borderWidth: 2,
        borderRadius: 25,
        padding: 10,
        marginVertical: 2,
        flexDirection: 'row',
        justifyContent: 'space-between'
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
        fontSize: 18,
        color: colors.branco.padrao,
        textAlign: 'center'
    },
    botaoPedido:{
        borderRadius: 15,
        paddingHorizontal: 10,
        paddingVertical: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 5
    },
    botaoRecusar:{
        backgroundColor: colors.vermelho.erro
    },
    botaoAceitar:{
        backgroundColor: colors.verde.padrao
    },
    txtBotao:{
        color: colors.branco.padrao,
        textAlignVertical: 'center',
    },
    textoSemPedidos:{
        color: colors.branco.padrao
    },
    botaoConfirmaDeletar:{
        backgroundColor: colors.vermelho.padrao,
        flex:1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        borderRadius: 15,
        marginHorizontal:20
    },
    txtConfirmaDeletar:{
        color: colors.branco.padrao,
        textAlignVertical: 'center',
        marginLeft: 7
    }
})