import UserService from "@/services/user_service";
import BaseModal from "./base/modal";
import { useEffect, useState } from "react";
import StyledText from "./base/styledText";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { useSession } from "@/app/ctx";
import { colors } from "@/constants/Colors";
import { fonts } from "@/constants/Fonts";
import ErroInput from "./ErroInput";
import { errorHandlerDebug } from "@/services/service_config";
import User, { PedidoAmizade } from "@/classes/user";
import { router } from "expo-router";
import ModalConfirmacao from "./ModalConfirmacao";
import { Feather } from "@expo/vector-icons";

export enum TipoModalPesoAltura{
    peso, altura
}

interface Props{
    visible: boolean
    onClose: () => void,
    setVisible: (state: boolean) => void
}

export function ModalPedidosAmizade({visible, onClose, setVisible}: Props){
    const [pedidos, setPedidos] = useState<PedidoAmizade[]>([]);
    const [loading, setLoading] = useState(false);
    const [modalConfirma, setModalConfirma] = useState<{show:boolean, user: User | null}>({show: false, user: null});
    const [erro, setErro] = useState<string>("");
    const {id:userId} = JSON.parse(useSession().username ?? "{id:null}");
    const userService = UserService();

    useEffect(() => {
        if(visible) 
            getPedidos();
    }, [visible]);

    const close = () =>{
        setLoading(false);
        setPedidos([]);
        onClose();
    }

    const getPedidos = () => {
        setLoading(true);
        userService.getPedidosAmizade(userId)
            .then(res => setPedidos(res))
            .catch(err => {
                errorHandlerDebug(err);
                if (err.response)
                    setErro(err.response.data.detail);
                else
                    setErro(err.message);
            })
            .finally(() => setLoading(false));
    }

    const aceitarAmizade = (id: number) =>
        userId && userService.aceitarAmizade(userId, id)
            .then(res => getPedidos())
            .catch(err => {
                errorHandlerDebug(err);
                if (err.response)
                    setErro(err.response.data.detail);
                else
                    setErro(err.message);
            });
    
    const recusarAmizade = (id: number) => 
        userId && userService.recusarAmizade(userId, id)
                .then(res => getPedidos())
                .catch(err => {
                    errorHandlerDebug(err);
                    if (err.response)
                        setErro(err.response.data.detail);
                    else
                        setErro(err.message);
                });

    const deletarAmizade = () => {
        if(!modalConfirma.user?.id) return;

        userService.deletarAmizade(userId, modalConfirma.user.id)
            .then(res => {
                setModalConfirma({show:false, user:null});
                getPedidos();
            })
            .catch(err => {
                errorHandlerDebug(err);
                if (err.response)
                    setErro(err.response.data.detail);
                else
                    setErro(err.message);
            });
    }

    const abrirTelaAmigo = (amigoId:number) => {
        setVisible(false);
        router.navigate({pathname: '/(auth)/perfil', params:{userId: amigoId}})
    };

    return (
        <BaseModal
            onClose={onClose}
            isVisible={visible}
        >
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

            <View style={styles.container}>
                <ErroInput 
                    show={!!erro}
                    texto={erro}
                />

                <StyledText style={styles.titulo}>Pedidos de amizade</StyledText>

            <FlatList
                data={pedidos}
                // refreshControl={<RefreshControl refreshing={loading} onRefresh={getPedidos}/>}
                onRefresh={() => setLoading(true)}
                refreshing={loading}
                contentContainerStyle={styles.containerAmigos}
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

                <TouchableOpacity onPress={close} style={[styles.botao]}>
                    <StyledText>FECHAR</StyledText> 
                </TouchableOpacity>
            </View>
        </BaseModal>
)};

const styles = StyleSheet.create({
    container:{
        margin:5
    },
    titulo:{
        fontFamily: fonts.padrao.SemiBold600,
        fontSize: 20,
    },
    containerAmigos:{
        flex:1,
        paddingVertical:14
    },
    botao:{
        alignItems: 'center',
        padding: 5,
        borderRadius: 15,
    },
    txtBotao:{
        color: colors.branco.padrao
    },
    botaoAdd: {
        backgroundColor: colors.cinza.medio,
        borderRadius: 25,
        flexDirection: "row",
        paddingHorizontal: 5,
        alignItems: "center"
    },
    textoAdd:{
        fontFamily: fonts.padrao.Regular400
    },
    iconeAdd:{
        fontSize: 24,
        color: colors.preto.padrao,
    },
    cardAmigo:{
        backgroundColor: colors.cinza.medio,
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
    textoSemPedidos:{
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