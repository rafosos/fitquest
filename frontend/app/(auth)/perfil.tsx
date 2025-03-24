import { StatusAmizade, UserPerfil } from '@/classes/user';
import { TipoTreino, TreinoResumo } from '@/classes/user_exercicio';
import StyledText from '@/components/base/styledText';
import { TipoModalPesoAltura } from '@/components/ModalEditarPesoAltura';
import { colors } from '@/constants/Colors';
import { fonts } from '@/constants/Fonts';
import ExercicioService from '@/services/exercicio_service';
import { errorHandlerDebug } from '@/services/service_config';
import UserService from '@/services/user_service';
import { showDiaMes } from '@/utils/functions';
import { AntDesign } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, FlatList, Image, RefreshControl, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSession } from '../ctx';

class DataFlatlist{
  constructor(title:string, value: any, editable = true, tipo: TipoModalPesoAltura | undefined = undefined) {
    this.title = title;
    this.value = value;
    this.editable = editable;
    this.tipo = tipo;
  }

  title: string;
  value: any;
  editable: boolean;
  tipo: TipoModalPesoAltura | undefined;
}

export default function Perfil() {
    const [atividades, setAtividades] = useState<TreinoResumo[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [erro, setErro] = useState<string | null>();
    const [user, setUser] = useState<UserPerfil>();
    const exercicioService = ExercicioService();
    const userService = UserService();

    const params = useLocalSearchParams();
    const { userId: amigoId } = params;

    useEffect(() => {
        refresh();
    }, []);
    
    const refresh = () => {
        getPerfilUser();
        getAtividades();
    }

    const getPerfilUser = () => {
        if(!amigoId) return

        userService.getPerfilUsuario(Number(amigoId))
            .then(res => {
                setUser(res);
                setErro(null);
            })
            .catch(err => {
                if (err.response){
                    setErro(err.response.data.detail)}
                else
                    setErro(err.message)
            });
    }
    
    const getAtividades = () => {
        if(!amigoId) return

        setRefreshing(true);
        exercicioService.getUltimosTreinosResumo(Number(amigoId))
        .then(res => setAtividades(res))
        .catch(err => errorHandlerDebug(err))
        .finally(() => setRefreshing(false))
    }

    const aceitarAmizade = () => {
        userService.aceitarAmizade(Number(amigoId))
        .then(res => getPerfilUser())
        .catch(err =>{ 
            errorHandlerDebug(err)
            setErro("Não foi possivel aceitar o pedido de amizade.")})
    }
  
    const desfazerAmizade = () => {
        userService.deletarAmizade(Number(amigoId))
        .then(res => getPerfilUser())
        .catch(err =>{ 
            errorHandlerDebug(err)
            setErro("Não foi possivel deletar a amizade/pedido de amizade.")})
    }
    
    const adicionarAmigo = () => {
        userService.addAmigo(Number(amigoId))
            .then(() => getPerfilUser())
            .catch(err => {
                errorHandlerDebug(err)
                setErro("Não foi possivel enviar o pedido de amizade.")})
    }

    const getData = () => {
        return [
            new DataFlatlist('Streak semanal', user?.streak_semanal?.streak_length, false),
            new DataFlatlist('Streak diário', user?.streak_diario?.streak_length, false)
        ];
    }

    if(!amigoId || erro)
        return (
            <View style={s.container}>
                <AntDesign name="arrowleft" size={24} color={colors.branco.padrao} onPress={() => router.back()} />
                <StyledText style={s.txtErroUsuario}>Ocorreu um erro ao buscar as informações deste usuário.</StyledText>
                <StyledText>{erro}</StyledText>
            </View>
        )

    return (
      <View style={s.container}>
        <FlatList
            contentContainerStyle={s.containerFlatlist}
            data={atividades}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh}/>}
            ListHeaderComponent={<>
                <View style={s.containerNomes}>
                    <AntDesign name="arrowleft" size={24} color={colors.branco.padrao} onPress={() => router.back()} />
                    <StyledText style={s.username}>{user?.username}</StyledText>
                </View>

                <View style={s.containerImagem}>
                    <Image style={s.gifAvatar} source={require('@/assets/images/avatar-home.png')} />
                </View>

                {user?.status_amizade == StatusAmizade.Ativa? 
                    <TouchableOpacity onPress={desfazerAmizade} style={[s.botaoAmigo, s.botaoDesfazerAmizade]}>
                        <StyledText style={s.txtBotao}>DESFAZER AMIZADE</StyledText>
                    </TouchableOpacity>
                : user?.status_amizade == StatusAmizade.Pendente  ?
                    user.autor_pedido ?
                    <TouchableOpacity onPress={desfazerAmizade} style={[s.botaoAmigo, s.botaoPedidoEnviado]}>
                        <StyledText style={s.txtBotao}>PEDIDO ENVIADO</StyledText>
                    </TouchableOpacity>
                    :
                    <TouchableOpacity onPress={aceitarAmizade} style={[s.botaoAmigo, s.botaoAdicionar]}>
                        <StyledText style={s.txtBotao}>ACEITAR AMIZADE</StyledText>
                    </TouchableOpacity>
                :
                    <TouchableOpacity onPress={adicionarAmigo} style={[s.botaoAmigo, s.botaoAdicionar]}>
                        <StyledText style={s.txtBotao}>ADICIONAR</StyledText>
                    </TouchableOpacity>
                }

                {user?.status && <StyledText style={s.status}>{user?.status}</StyledText>}

                <FlatList
                    data={getData()}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    renderItem={({item}) => item.value &&
                        <View style={[s.card, s.cardInformacoesPessoais]}>
                            <StyledText>{item.title}: <StyledText style={s.txtStreak}>{item.value}</StyledText></StyledText> 
                        </View>
                    }
                />

                <StyledText style={s.tituloUltimasAtividades}>Últimas atividades</StyledText>
            </>}
            renderItem={({item}) => 
                <View style={s.card}>
                    <View style={s.headerCard}>
                        <View>
                            <StyledText style={s.nomeTreino}>{item.nome ?? "Treino"}</StyledText>
                            <View style={s.chip}>
                                <StyledText style={s.txtChip}>{item.tipo && TipoTreino[item.tipo]}</StyledText>
                            </View>
                        </View>

                        <StyledText>{showDiaMes(item.data)}</StyledText>
                    </View>

                <StyledText>{item.exercicios}</StyledText>
                </View>
            }
            ListEmptyComponent={<StyledText style={s.txtNenhumaAtividade}>Nenhuma atividade recente.</StyledText>}
        />
        </View>
    );
}

const s = StyleSheet.create({
    container:{
        flex:1,
        flexDirection: 'column',
        backgroundColor: colors.cinza.background
    },
    txtErroUsuario:{
        color: colors.branco.padrao, 
        textAlignVertical: 'center', 
        flex:1, 
        marginHorizontal: 25, 
        textAlign: 'center'
    },
    containerFlatlist:{
        padding: 10,
    },
    containerNomes:{
        flexDirection: "row",
        alignItems: 'center'
    },
    username:{
        color: colors.branco.padrao,
        fontSize: 30,
        textAlignVertical: 'center',
        fontFamily: fonts.padrao.Regular400,
        marginLeft: 10
    },
    containerImagem:{
        overflow: "hidden",
        justifyContent: "center",
        height: Dimensions.get('window').height * 0.3
    },
    gifAvatar:{
        resizeMode: "contain",
        height: '100%',
        alignSelf: "center"
    },
    botaoAmigo:{
        borderRadius:15,
        padding: 7
    },
    botaoDesfazerAmizade:{
        backgroundColor: colors.vermelho.padrao
    },
    botaoPedidoEnviado:{
        backgroundColor: colors.cinza.medio2
    },
    botaoAdicionar:{
        backgroundColor: colors.verde.padrao
    },
    txtBotao:{
        textAlign: 'center',
        color: colors.branco.padrao
    },
    status:{
        backgroundColor: colors.branco.padrao,
        borderRadius: 10,
        padding: 10,
        marginTop: 10
    },
    streaksContainer:{
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    txtStreak:{
        textAlign: 'center'
    },
    iconeEditar:{
        fontSize: 18, 
        color: colors.verde.padrao,
        marginLeft: 5
    },
    tituloUltimasAtividades:{
        fontSize: 20,
        fontFamily: fonts.padrao.Medium500,
        textAlign: 'center',
        color: colors.branco.padrao
    },
    card:{
        marginVertical: 5,
        borderColor: colors.cinza.escuro,
        backgroundColor: colors.branco.padrao,
        borderWidth: 2,
        borderRadius: 10,
        padding: 10
    },
    cardInformacoesPessoais:{
        flexDirection: 'row',
        justifyContent: "space-between",
        borderRadius: 20,
        paddingHorizontal: 15
    },
    headerCard:{
        flexDirection:"row",
        justifyContent: "space-between"
    },
    nomeTreino:{
        fontFamily: fonts.padrao.SemiBold600
    },
    chip:{

    },
    txtChip:{
        fontFamily: fonts.padrao.Light300
    },
    txtNenhumaAtividade:{
        color: colors.branco.padrao,
        textAlign: 'center'
    }
})