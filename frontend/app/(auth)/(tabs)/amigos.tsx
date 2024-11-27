import React, { useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, TouchableOpacity, View } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useSession } from '@/app/ctx';
import User from '@/classes/user';
import AddUserModal from '@/components/AddUserModal';
import UserService from '@/services/user_service';
import { colors } from '@/constants/Colors';
import ModalConfirmacao from '@/components/ModalConfirmacao';
import { Feather, Ionicons } from '@expo/vector-icons';
import { errorHandlerDebug } from '@/services/service_config';
import StyledText from '@/components/base/styledText';
import { fonts } from '@/constants/Fonts';
import { router } from 'expo-router';

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

    const abrirTelaAmigo = (amigoId:number) => router.navigate({pathname: '/(auth)/perfil', params:{userId: amigoId}});

    return (<View style={styles.container}>
        <AddUserModal
            isVisible={addModal}
            onClose={onCloseModal}
        />

        <ModalConfirmacao
            show={modalConfirma.show}
            onClose={() => setModalConfirma({show: false, user: null})}
            onConfirma={deletarAmizade}
            titulo={`Deseja realmente desfazer a amizade com ${modalConfirma.user?.username}?`}
            botaoConfirmar={
            <TouchableOpacity onPress={deletarAmizade} style={styles.botaoConfirmaDeletar}>
                <Feather name="trash-2" size={18} color={colors.branco.padrao}/>
                <StyledText style={styles.txtConfirmaDeletar}>DESFAZER</StyledText>
            </TouchableOpacity>}
        />

        <FlatList
            data={amigos}
            contentContainerStyle={styles.containerAmigos}
            refreshControl={<RefreshControl refreshing={loadingAmigos} onRefresh={refreshAmigos}/>}
            ListHeaderComponent={<View style={styles.containerHeader}>
                <StyledText style={styles.titulo}>Amigos</StyledText>
                <TouchableOpacity style={styles.botaoAdd} onPress={() => setAddModal(true)}>
                        <StyledText style={styles.textoAdd}>Adicionar amigo</StyledText>
                        <Ionicons name="add-circle" style={styles.iconeAdd} />
                    </TouchableOpacity>
            </View>}
            renderItem={({item:amigo}) =>
                <TouchableOpacity style={styles.cardAmigo} onPress={() => abrirTelaAmigo(amigo.id)}>
                    <View>
                        <StyledText style={styles.username}>{amigo.username}</StyledText>
                        <StyledText style={styles.fullname}>{amigo.fullname}</StyledText>
                    </View>
                    <Feather name="trash-2" size={24} color={colors.vermelho.padrao} onPress={() => setModalConfirma({show:true, user: amigo})}/>
                </TouchableOpacity>
            }
            ListEmptyComponent={
                <View style={styles.containerSemAmigos}>
                    <StyledText style={styles.textoSemAmigos}>Parece que ainda não tem ninguém aqui... {"\n"}Adicione alguém agora!</StyledText>
                    <AntDesign onPress={abrirModal} name="adduser" style={styles.iconeAddAmigo} />
                </View>
            }
        />

        <FlatList
            data={pedidosAmizade}
            refreshControl={<RefreshControl refreshing={loadingRequests} onRefresh={refreshRequests}/>}
            contentContainerStyle={styles.containerAmigos}
            ListHeaderComponent={<>
                <StyledText style={styles.subTitulo}>Pedidos de amizade</StyledText>
            </>}
            renderItem={({item:pedido}) =>
                <TouchableOpacity style={styles.cardAmigo} onPress={() => abrirTelaAmigo(pedido.id)}>
                    <View>
                        <StyledText style={styles.username}>{pedido.username}</StyledText>
                        <StyledText style={styles.fullname}>{pedido.fullname}</StyledText>
                    </View>

                    <View style={{flexDirection: 'row'}}>
                        <TouchableOpacity onPress={() => recusarAmizade(pedido.id)} style={[styles.botaoPedido, styles.botaoRecusar]}>
                            <StyledText style={styles.txtBotao}>RECUSAR</StyledText>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => aceitarAmizade(pedido.id)} style={[styles.botaoPedido, styles.botaoAceitar]}>
                            <StyledText style={styles.txtBotao}>ACEITAR</StyledText>  
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            }
            ListEmptyComponent={<>
                <StyledText style={styles.textoSemPedidos}>Você não tem pedidos pendentes.</StyledText>
            </>}
        />

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
    containerHeader:{
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    titulo:{
        fontSize: 25,
        fontFamily: fonts.padrao.Bold700,
        color: colors.branco.padrao
    },
    botaoAdd: {
        backgroundColor: colors.cinza.medio,
        borderRadius: 25,
        flexDirection: "row",
        paddingHorizontal: 5,
        paddingLeft: 7,
        alignItems: "center"
    },
    textoAdd:{
        fontFamily: fonts.padrao.Regular400
    },
    iconeAdd:{
        fontSize: 24,
        color: colors.preto.padrao,
        marginLeft: 2
    },
    cardAmigo:{
        backgroundColor: colors.branco.padrao,
        borderColor: colors.cinza.escuro,
        borderWidth: 2,
        borderRadius: 25,
        padding: 13,
        marginVertical: 2,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    username:{
        fontSize: 17,
        fontFamily: fonts.padrao.Bold700
    },
    fullname:{
    },
    containerSemAmigos:{
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    textoSemAmigos:{
        color: colors.branco.padrao,
        textAlign: 'center',
    },
    iconeAddAmigo:{
        backgroundColor: colors.cinza.claro,
        padding: 10,
        borderRadius: 25,
        color: colors.branco.padrao,
        marginTop: 10,
        fontSize: 30
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
    subTitulo:{
        fontSize: 25,
        fontFamily: fonts.padrao.Bold700,
        color: colors.branco.padrao,
        textAlign: 'center'
    },
    textoSemPedidos:{
        color: colors.branco.padrao,
        textAlign: 'center'
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