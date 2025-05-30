import React, { useEffect, useState } from 'react';
import { FlatList, Image, RefreshControl, StyleSheet, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
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
import { ModalPedidosAmizade } from '@/components/amigos/ModalPedidosAmizade';
import { ErrorHandler } from '@/utils/ErrorHandler';
import { SceneMap, TabBar, TabView } from 'react-native-tab-view';
import { ListaPedidosAmizade } from '@/components/amigos/ListaPedidosAmizade';

export default function TabAmigos() {
    const [addModal, setAddModal] = useState(false);
    const [amigos, setAmigos] = useState<User[]>([]);
    const [modalPedidos, setModalPedidos] = useState(false);
    const [modalConfirma, setModalConfirma] = useState<{show:boolean, user: User | null}>({show: false, user: null});
    const [loadingAmigos, setLoadingAmigos] = useState(false);
    const [index, setIndex] = useState(0);
    const [routes, setRoutes] = useState([
        {key: "amigos", title: "Amigos"},
        {key: "solicitacoes", title: "Solicitações"}
    ]);
    const layout = useWindowDimensions();
    const errorHandler = ErrorHandler();
    const userService = UserService();

    useEffect(() => refreshFriendList(), []);

    const refreshFriendList = () => {
        refreshAmigos();
    }
        
    const refreshAmigos = () => {
        setLoadingAmigos(true);
        userService.getAmigos()
            .then(res => setAmigos(res))
            .catch(err => errorHandler.handleError(err))
            .finally(() => setLoadingAmigos(false));          
    }
        
    const onCloseModal = () => {
        setAddModal(false);
        setModalPedidos(false);
        setModalConfirma({show:false, user: null});
        refreshFriendList();
        // show smth for user, some feedback
    }

    const abrirModal = () => setAddModal(true);

    const deletarAmizade = () => {
        if(!modalConfirma.user?.id) return;

        userService.deletarAmizade(modalConfirma.user.id)
            .then(res => {
                setModalConfirma({show:false, user:null});
                refreshFriendList();
            })
            .catch(err => errorHandlerDebug(err));
    }

    const abrirTelaAmigo = (amigoId:number) => 
        router.navigate({pathname: '/(auth)/perfil', params:{userId: amigoId}});

    return (<View style={styles.container}>
        <AddUserModal
            isVisible={addModal}
            onClose={onCloseModal}
        />

        <ModalPedidosAmizade 
            visible={modalPedidos}
            onClose={onCloseModal}
            setVisible={setModalPedidos}
        />

        <ModalConfirmacao
            show={modalConfirma.show}
            onClose={onCloseModal}
            onConfirma={deletarAmizade}
            titulo="Desfazer amizade"
            subtitulo={`Deseja mesmo desfazer a amizade com ${modalConfirma.user?.username}?`}
        />

            <View style={styles.containerHeader}>
                <StyledText style={styles.titulo}>Amigos</StyledText>

                <TouchableOpacity style={styles.botaoAdd} onPress={() => setAddModal(true)}>
                    <AntDesign name="adduser" style={styles.iconeAdd} />
                    <StyledText style={styles.txtBotaoAdd}>Adicionar</StyledText>
                </TouchableOpacity>

            </View>

        <TabView
            navigationState={{index, routes}}
            onIndexChange={setIndex}
            lazy={({route}) => route.key == routes[1].key}
            initialLayout={{width: layout.width}}
            renderTabBar={(props) => 
                <TabBar 
                    {...props}
                    tabStyle={{backgroundColor: colors.cinza.medio4}}
                />
            }
            renderScene={SceneMap({
                amigos: () =>
                    <FlatList
                        data={amigos}
                        contentContainerStyle={styles.containerAmigos}
                        refreshControl={<RefreshControl refreshing={loadingAmigos} onRefresh={refreshAmigos}/>}
                        renderItem={({item:amigo}) =>
                            <TouchableOpacity style={styles.cardAmigo} onPress={() => abrirTelaAmigo(amigo.id)}>
                                <View style={styles.conteudoCardRow}>
                                    <View style={styles.containerImgNome}>
                                        <Image source={require('@/assets/images/avatar-amigo.png')} style={styles.imgAvatar}/>
                                        <View>
                                            <StyledText style={styles.username}>{amigo.username}</StyledText>
                                            {/* <StyledText style={styles.fullname}>{amigo.fullname}</StyledText> */}
                                            {amigo.status && <StyledText style={styles.status}>{amigo.status}</StyledText>}
                                        </View>
                                    </View>
                                    {/* <Feather name="trash-2" size={24} color={colors.vermelho.padrao} onPress={() => setModalConfirma({show:true, user: amigo})}/> */}
                                </View>
                            </TouchableOpacity>
                        }
                        ListEmptyComponent={
                            <View style={styles.containerSemAmigos}>
                                <StyledText style={styles.textoSemAmigos}>Parece que ainda não tem ninguém aqui... {"\n"}Adicione alguém agora!</StyledText>
                                <AntDesign onPress={abrirModal} name="adduser" style={styles.iconeAddAmigo} />
                            </View>
                        }
                    />,
                solicitacoes: () =>
                    <ListaPedidosAmizade/>,
            })}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        backgroundColor: colors.preto.padrao,
        flex:1,
        padding: 10
    },
    containerAmigos:{
        flex:1,
        padding:14
    },
    containerHeader:{
        marginBottom: 20,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    titulo:{
        fontSize: 25,
        fontFamily: fonts.padrao.Bold700,
        color: colors.branco.padrao
    },
    botaoAdd: {
        backgroundColor: colors.verde.padrao2,
        gap: 10,
        borderRadius: 10,
        flexDirection: "row",
        paddingHorizontal: 10,
        alignItems: "center"
    },
    txtBotaoAdd:{
        fontFamily: fonts.padrao.Regular400,
        color: colors.branco.padrao
    },
    iconeAdd:{
        fontSize: 20,
        color: colors.branco.padrao,
    },
    cardAmigo:{
        backgroundColor: colors.cinza.medio4,
        borderRadius: 15,
        padding: 13,
        marginVertical: 2,
    },
    conteudoCardRow:{
        flexDirection: 'row',
        justifyContent: 'space-between'

    },
    containerImgNome:{
        flexDirection: 'row', 
        alignItems: 'center'
    },
    imgAvatar:{
        height: 40,
        width: 40,
        marginRight: 10
    },
    username:{
        fontSize: 17,
        fontFamily: fonts.padrao.Bold700,
        color: colors.branco.padrao
    },
    fullname:{
        fontFamily: fonts.padrao.Regular400,
        color: colors.branco.padrao,
        lineHeight: 15,
    },
    status:{
        fontFamily: fonts.padrao.ExtraLight200,
        fontStyle: 'italic',
        color: colors.cinza.claro
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