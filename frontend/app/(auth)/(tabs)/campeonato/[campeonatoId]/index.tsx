import { View, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import { useEffect, useState } from 'react';
import { Entypo, Feather } from '@expo/vector-icons';
import { useSession } from '@/app/ctx';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { colors } from '@/constants/Colors';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { Atividade, CampeonatoDetalhes, UserProgresso } from '@/classes/campeonato';
import CampeonatoService from '@/services/campeonato_service';
import StyledText from '@/components/base/styledText';
import { fonts } from '@/constants/Fonts';
import { errorHandlerPadrao, showDiaMes } from '@/utils/functions';
import { HeaderPaginaDetalhes } from '@/components/base/headerModalPaginaDetalhes';
import ErroInput from '@/components/ErroInput';
import ModalConfirmacao from '@/components/ModalConfirmacao';
import { ErrorHandler } from '@/utils/ErrorHandler';
import ListaExercicios from '@/components/campeonato/ListaExercicios';
import ListaParticipantes from '@/components/campeonato/ListaParticipantes';
import ListaAtividades from '@/components/campeonato/ListaAtividades';
import { useToast } from 'react-native-toast-notifications';

export default function DetalhesCampeonato() {
    const [campeonato, setCampeonato] = useState<CampeonatoDetalhes>();
    const [progresso, setProgresso] = useState<UserProgresso[]>([]);
    const [atividades, setAtividades] = useState<Atividade[]>([]);
    const [loadingDetalhes, setLoadingDetalhes] = useState(false);
    const [modalConfirma, setModalConfirma] = useState(false);
    const [erro, setErro] = useState("");
    const [index, setIndex] = useState(0);
    const [routes] = useState([
        {key: "exercicios", title: "Exercícios"}, 
        {key: 'atividades', title: "Atividades"},
        {key: 'participantes', title: "Participantes"}
    ]);

    const campeonatoService = CampeonatoService();
    const errorHandler = ErrorHandler();
    const layout = useWindowDimensions();
    const toast = useToast();
    const userId = Number(useSession().id);
    const campeonatoId = Number(useLocalSearchParams().campeonatoId);

    const navigation = useNavigation<BottomTabNavigationProp<any>>();
    useEffect(() => {
      navigation.getParent("/(auth)/(tabs)")?.setOptions({ tabBarStyle: { display: 'none' } });
      return () => {
        navigation.getParent("/(auth)/(tabs)")?.setOptions({ tabBarStyle: { display: 'flex' } });
      };
    }, [navigation]);

    useEffect(() => refresh(), []);
    
    const refresh = () => {
        if (!campeonatoId) return
        getDetalhes();
        getProgresso();
        getAtividades();
    }
    
    const getDetalhes = () => {
        setLoadingDetalhes(true);
        campeonatoService.getCampeonatoDetalhes(campeonatoId)
        .then(res => setCampeonato(res))
        .catch(err => errorHandler.handleError(err))
        .finally(() => setLoadingDetalhes(false));
    }
    
    const getProgresso = () => 
        campeonatoService.getDetalhesProgresso(campeonatoId)
            .then(res => setProgresso(res))
            .catch(err => errorHandler.handleError(err));
            
    const getAtividades = () =>
        campeonatoService.getAtividades(campeonatoId)
            .then(res => setAtividades(res))
            .catch(err => errorHandler.handleError(err));

    const iniciarNovoTreino = () => {
        if(getDiasRestantes() == 'encerrado'){
            toast.show("Campeonato encerrado, não é possível adicionar mais treinos :(");
            return;
        }
        router.push({pathname: `/(auth)/(tabs)/campeonato/[campeonatoId]/treino`, params:{campeonatoId, campeonatoNome: campeonato?.nome}});
        setIndex(0);
    }
    
    const clearAndClose = () => {
        setModalConfirma(false);
        setIndex(0);
        router.back();
    }

    const entrarCampeonato = () => {
        campeonatoService.entrarCampeonato(campeonatoId)
            .then(res => refresh())
            .catch(err => errorHandlerPadrao(err, setErro))
    }

    const deletar = () => {
        if (!campeonato) return
        campeonatoService.deleteCampeonato(campeonato.id)
            .then(res => clearAndClose())
            .catch(err => errorHandlerPadrao(err, setErro))
    }
        
    const sair = () => {
        if (!campeonato) return
        campeonatoService.sairCampeonato(campeonato.id)
            .then(res => clearAndClose())
            .catch(err => errorHandlerPadrao(err, setErro))
    }

    const datediff = (destino: Date, hoje: Date) => {
        return Math.round((destino.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
    }

    const getDiasRestantes = () => {
        if (!campeonato?.duracao) return "...";
        const dias = datediff(new Date(campeonato.duracao), new Date());
        if (dias < 0) return "encerrado";
        else return `${dias} dias`;
    }

    const abrirAtividade = (id:number) => 
        router.navigate({pathname: "/(auth)/(tabs)/campeonato/[campeonatoId]/atividade/[id]", params:{campeonatoId, id}});

    return (
        <View style={styles.containerAll}>
            <ModalConfirmacao 
                show={modalConfirma}
                onConfirma={deletar}
                onClose={() => setModalConfirma(false)}
                titulo={`Você tem certeza que deseja ${campeonato?.criadorId == userId? "excluir ": "sair d"}o campeonato ${campeonato?.nome}?`}
                subtitulo={campeonato?.criadorId == userId? "Essa ação não poderá ser desfeita." : "O seu progresso será salvo."}
                botaoConfirmar={campeonato?.criadorId == userId ?
                    <TouchableOpacity onPress={deletar} style={styles.botaoDeletar}>
                        <Feather name="trash-2" style={styles.iconeDeletar} />
                        <StyledText style={styles.txtBotaoDeletar}>EXCLUIR</StyledText>
                    </TouchableOpacity> 
                    :
                    <TouchableOpacity onPress={sair} style={styles.botaoDeletar}>
                        <Entypo name="log-out" style={styles.iconeDeletar} />
                        <StyledText style={styles.txtBotaoDeletar}>SAIR</StyledText>
                    </TouchableOpacity>
                }
            />
            
            <View style={styles.header}>
                <HeaderPaginaDetalhes 
                    titulo={campeonato?.nome ?? "..."}
                    onClose={router.back}
                    onDelete={() => setModalConfirma(true)}
                    showSair={userId != campeonato?.criadorId && campeonato?.joined}
                    showDelete={campeonato?.joined}
                />
            </View>

            <ErroInput
                show={!!erro}
                texto={erro}
                setShow={setErro}
            />

            <View style={styles.infoContainer}>
                <View style={styles.itemInfo}>
                    <StyledText style={styles.txtCardHeader}>Dia final</StyledText>
                    <StyledText style={styles.title}>{showDiaMes(campeonato?.duracao)}</StyledText>
                </View>
                <View style={styles.itemInfo}>
                    <StyledText style={styles.txtCardHeader}>Dias restantes</StyledText>
                    <StyledText style={styles.title}>{getDiasRestantes()}</StyledText>
                </View>
            </View>
            <View style={styles.infoContainer}>
                <View style={styles.itemInfo}>
                    <StyledText style={styles.txtCardHeader}>Seus pontos</StyledText>
                    <StyledText style={styles.title}>{progresso.find(u => u.user_id == userId)?.pontos ?? "..."}</StyledText>
                </View>
                
                <View style={styles.itemInfo}>
                    <StyledText style={styles.txtCardHeader}>Seu último treino</StyledText>
                    <StyledText style={styles.title}>{showDiaMes(campeonato?.ultimo_treino)}</StyledText>
                </View>
            </View>

            {!campeonato?.joined?
                <TouchableOpacity style={styles.botaoTreino} onPress={entrarCampeonato} disabled={loadingDetalhes}>
                    <Entypo name="login" style={styles.iconeBotaoTreino} />
                    <StyledText style={styles.txtBotaoNovoTreino}>ENTRAR NO CAMPEONATO</StyledText>
                </TouchableOpacity>
                :
                <TouchableOpacity style={styles.botaoTreino} onPress={iniciarNovoTreino}>
                    <Entypo name="controller-play" style={styles.iconeBotaoTreino} />
                    <StyledText style={styles.txtBotaoNovoTreino}>INICIAR TREINO</StyledText>
                </TouchableOpacity>
            }

            <TabView
                navigationState={{index, routes}}
                onIndexChange={setIndex}
                lazy={({ route }) => route.title === 'participantes'}
                initialLayout={{width: layout.width}}
                renderTabBar={(props) => 
                    <TabBar 
                        {...props}
                        style={styles.tabs}
                        indicatorStyle={styles.tabIndicator}
                        activeColor={colors.verde.padrao}
                        inactiveColor={colors.branco.padrao}
                    />
                }
                renderScene={SceneMap({
                    exercicios: () => 
                        <ListaExercicios
                            exercicios={campeonato?.exercicios ?? []}
                            novoTreino={false}
                            refreshing={loadingDetalhes}
                        />,

                    atividades: () => 
                        <ListaAtividades atividades={atividades} abrirAtividade={abrirAtividade}/>,

                    participantes: () =>
                        <ListaParticipantes progresso={progresso} />
                    })
                }
            />        
        </View>
    );
}

const styles = StyleSheet.create({
    containerAll:{
        flex:1,
        backgroundColor: colors.cinza.background
    },
    header:{
        paddingHorizontal: 10
    },
    botaoDeletar:{
        flexDirection: "row",
        borderRadius: 15,
        backgroundColor: colors.vermelho.padrao,
        marginHorizontal:20,
        padding:5,
        paddingHorizontal: 20
    },
    txtBotaoDeletar:{
        color:colors.branco.padrao
    },
    iconeDeletar:{
        color: colors.branco.padrao,
        textAlignVertical: 'center',
        marginRight:5
    },
    txtCardHeader:{
        textAlign: 'center',
        color: colors.branco.padrao
    },
    title: {
        fontSize: 16,
        color: colors.branco.padrao,
        fontFamily: fonts.padrao.Bold700,
        textAlign: "center"
    },
    infoContainer: {
        flexDirection: 'row',
        justifyContent: "space-between",
    },
    itemInfo:{
        borderWidth: 1,
        borderColor: colors.branco.padrao,
        padding: 10,
        flex:1,
        margin:5,
        borderRadius: 4,
    },
    botaoTreino:{
        marginVertical: 15,
        padding: 5,
        borderRadius: 15,
        flexDirection: "row",        
        backgroundColor: colors.verde.padrao,
        alignItems: "center",
        justifyContent: "center"
    },
    txtBotaoNovoTreino:{
        color: colors.branco.padrao,
        fontSize: 15,
        textAlignVertical: "center",
    },
    iconeBotaoTreino:{
        color: colors.branco.padrao,
        fontSize: 20,
        marginRight: 10
    },
    tabs:{
        backgroundColor: colors.cinza.background,
    },
    tabIndicator:{
        backgroundColor: colors.verde.padrao
    },
    footerTreino:{
        flexDirection: "row",
        justifyContent: "space-between"    
    },
    botaoFooter:{
        flex:1,
        marginVertical: 15,
        marginHorizontal: 5,
        padding: 5,
        paddingHorizontal: 20,
        borderRadius: 15,
        flexDirection: "row",        
        backgroundColor: colors.verde.padrao,
        alignItems: "center",
        justifyContent: "center"
    },
    botaoFooterCancelar:{
        backgroundColor: colors.cinza.medio2
    }
});
  