import { useSession } from '@/app/ctx';
import { InformacoesUsuario } from '@/classes/streaks';
import User from '@/classes/user';
import { StatusTreino, TipoTreino, TreinoResumo } from '@/classes/user_exercicio';
import StyledText from '@/components/base/styledText';
import ErroInput from '@/components/ErroInput';
import ModalConfirmacao from '@/components/ModalConfirmacao';
import { TipoModalPesoAltura } from '@/components/ModalEditarPesoAltura';
import { colors } from '@/constants/Colors';
import { fonts } from '@/constants/Fonts';
import ExercicioService from '@/services/exercicio_service';
import { errorHandlerDebug } from '@/services/service_config';
import UserService from '@/services/user_service';
import { showDiaMes } from '@/utils/functions';
import { Feather } from '@expo/vector-icons';
import { Link } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, Image, RefreshControl, StyleSheet, TouchableOpacity, View } from 'react-native';

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

export default function TabAvatar() {
    const [atividades, setAtividades] = useState<TreinoResumo[]>([]);
    const [informacoesUsuario, setInformacoesUsuario] = useState<InformacoesUsuario>();
    const [modalConfirma, setModalConfirma] = useState<{show:boolean, treino: TreinoResumo | null}>({show: false, treino: null});
    const [refreshing, setRefreshing] = useState(false);
    const [erro, setErro] = useState<string>("");
    const { username: userString } = useSession();
    const user: User = useRef(JSON.parse(userString ?? "{}")).current;
    
    const exercicioService = ExercicioService();
    const userService = UserService();

    useEffect(() => {
        refresh();
    }, []);
    
    const refresh = () => {
        getInformacoesUsuario();
        getAtividades();
    }

    const getInformacoesUsuario = () => {
        userService.getInformacoesUsuario()
            .then(res => {
                setInformacoesUsuario(res);
                setErro("");
            })
            .catch(err => {
              errorHandlerDebug(err);
                if (err.response){
                    setErro(err.response.data.detail)}
                else
                    setErro(err.message)
            });
    }
    
    const getAtividades = () => {
        setRefreshing(true)
        exercicioService.getUltimosTreinosResumo()
        .then(res => setAtividades(res))
        .catch(err => errorHandlerDebug(err))
        .finally(() => setRefreshing(false))
    }



    const getData = () => {
        return [
            new DataFlatlist('Streak semanal', informacoesUsuario?.streak_semanal?.streak_length, false),
            new DataFlatlist('Streak diário', informacoesUsuario?.streak_diario?.streak_length, false),
            // new DataFlatlist('Peso', informacoesUsuario?.peso ?? "...", true, TipoModalPesoAltura.peso),
            // new DataFlatlist('Altura', informacoesUsuario?.altura ?? "...", true, TipoModalPesoAltura.altura),
        ];
    }

    const deletarTreino = () => {
        setRefreshing(true);
        exercicioService.atualizarStatusTreino(Number(modalConfirma.treino?.id), StatusTreino.deletado)
            .then(res => onCloseModalConfirmacao())
            .catch(err => {
                errorHandlerDebug(err)
                if (err.response){
                    setErro(err.response.data.detail)}
                else
                    setErro(err.message)
            })
            .finally(() => setRefreshing(false));
    }

    const onCloseModalConfirmacao = () => {
        setModalConfirma({show: false, treino: null});
        getAtividades();
    }

    return (
    <View style={s.container}>

        <ModalConfirmacao
            show={modalConfirma.show}
            onClose={onCloseModalConfirmacao}
            onConfirma={deletarTreino}
            titulo="Mover para lixeira"
            subtitulo="Deseja mover o treino para a lixeira? Treinos na lixeria fserão permanentemente excluídos após 15 dias."
            botaoConfirmar={
                <TouchableOpacity style={s.botaoConfirmarModal} onPress={deletarTreino}>
                    <Feather name="trash-2" size={12} color={colors.branco.padrao} />
                    <StyledText style={s.txtBotao}>CONFIRMAR</StyledText>
                </TouchableOpacity>
            }
        />

        <FlatList
            contentContainerStyle={s.containerFlatlist}
            data={atividades}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh}/>}
            ListHeaderComponent={<>
                <View style={s.containerNomes}>
                    <StyledText style={s.username}>{user.username}</StyledText>
                    <Link href="/configuracoes">
                        <Feather name="settings" style={s.iconeConfigs} />
                    </Link>
                </View>

                <View style={s.containerImagem}>
                    <Image style={s.gifAvatar} source={require('@/assets/images/avatar-home.png')} />
                </View>

                <ErroInput 
                    show={!!erro}
                    texto={erro}
                    setShow={setErro}
                />

                {informacoesUsuario?.status && <StyledText style={s.status}>{informacoesUsuario?.status}</StyledText>}

                {/* <FlatList
                    data={getData()}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    renderItem={({item}) =>
                        <View style={[s.card, s.cardInformacoesPessoais]}>
                            <StyledText>{item.title}: <StyledText style={s.txtStreak}>{item.value}</StyledText></StyledText> 
                        </View>
                    }
                /> */}

{/* new DataFlatlist('Streak semanal', informacoesUsuario?.streak_semanal?.streak_length, false),
new DataFlatlist('Streak diário', informacoesUsuario?.streak_diario?.streak_length, false), */}

                <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                  <View style={[s.card, s.cardInformacoesPessoais]}>
                      <StyledText>Streak semanal: <StyledText style={s.txtStreak}>{informacoesUsuario?.streak_semanal?.streak_length}</StyledText></StyledText> 
                  </View>
                  <View style={[s.card, s.cardInformacoesPessoais]}>
                      <StyledText>Streak diário: <StyledText style={s.txtStreak}>{informacoesUsuario?.streak_diario?.streak_length}</StyledText></StyledText> 
                  </View>
                </View>

                <StyledText style={s.tituloUltimasAtividades}>Últimas atividades</StyledText>
            </>}
            renderItem={({item}) => 
                <View style={s.card}>
                    <View style={s.headerCard}>
                        <View>
                            <StyledText style={s.nomeTreino}>{item.nome ?? "Treino"}</StyledText>
                            <StyledText style={s.data}>{showDiaMes(item.data)}</StyledText>
                            <View style={s.chip}>
                                <StyledText style={s.txtChip}>{item.tipo && TipoTreino[item.tipo]}</StyledText>
                            </View>
                        </View>

                        <Feather 
                            name="trash-2" 
                            size={15} 
                            color={colors.vermelho.padrao} 
                            onPress={() => setModalConfirma({show:true, treino: item})}
                        />

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
  botaoConfirmarModal:{
    backgroundColor: colors.vermelho.padrao,
    paddingHorizontal: 25,
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 15
  },
  txtBotao:{
    color: colors.branco.padrao,
    marginLeft: 5
  },
  containerFlatlist:{
    padding: 10,
  },
  containerNomes:{
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: 'center'
  },
  username:{
    color: colors.branco.padrao,
    fontSize: 30,
    fontFamily: fonts.padrao.Regular400
  },
  iconeConfigs:{
    color: colors.branco.padrao,
    fontSize: 24
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
    status:{
        backgroundColor: colors.branco.padrao,
        borderRadius: 10,
        padding:10
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
    color: colors.branco.padrao,
    marginTop: 10
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
  data:{
    fontSize: 12
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